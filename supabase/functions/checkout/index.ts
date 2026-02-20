import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
    "https://menudebordonavegai.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
];

function getCorsHeaders(origin: string | null) {
    const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
}

interface CheckoutRequest {
    lead_id: string;
    name: string;
    email: string;
    whatsapp?: string;
    taxId: string;
    plan_id: string;
}

const PLANS: Record<string, { name: string; price: number; description: string }> = {
    basic: {
        name: "Cardápio Digital",
        price: 49.90,
        description: "Assinatura Mensal — Cardápio Digital com gestão de pedidos via WhatsApp",
    },
    pro: {
        name: "Gestão PRO",
        price: 100.00,
        description: "Assinatura Mensal — Gestão PRO com painel Kanban e notificações automáticas",
    },
};

function getNextDueDate(): string {
    const d = new Date();
    return d.toISOString().split("T")[0]; // YYYY-MM-DD (today = charge immediately)
}

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const body: CheckoutRequest = await req.json();
        const { lead_id, name, email, whatsapp, taxId, plan_id } = body;

        if (!lead_id || !name || !email || !taxId || !plan_id) {
            return new Response(
                JSON.stringify({ error: "Campos obrigatórios ausentes" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const plan = PLANS[plan_id];
        if (!plan) {
            return new Response(
                JSON.stringify({ error: "Plano inválido" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const asaasApiUrl = Deno.env.get("ASAAS_API_URL");
        const asaasApiKey = Deno.env.get("ASAAS_API_KEY");

        if (!asaasApiUrl || !asaasApiKey) {
            return new Response(
                JSON.stringify({ error: "Gateway de pagamento não configurado." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const asaasHeaders = {
            "Content-Type": "application/json",
            "access_token": asaasApiKey,
        };

        // Normalize taxId (digits only)
        const taxIdDigits = taxId.replace(/\D/g, "");

        // ── STEP 1: Find or create Asaas customer ──────────────────────────────
        let customerId: string;

        const searchResp = await fetch(
            `${asaasApiUrl}/customers?cpfCnpj=${taxIdDigits}&email=${encodeURIComponent(email)}&limit=1`,
            { headers: asaasHeaders }
        );

        if (!searchResp.ok) {
            const errText = await searchResp.text();
            console.error("Asaas customer search error:", errText);
            return new Response(
                JSON.stringify({ error: "Erro ao buscar cliente no gateway." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const searchData = await searchResp.json();
        const existingCustomer = searchData?.data?.[0];

        if (existingCustomer?.id) {
            customerId = existingCustomer.id;
            console.log(`Existing Asaas customer found: ${customerId}`);
        } else {
            // Create new customer
            const createCustomerResp = await fetch(`${asaasApiUrl}/customers`, {
                method: "POST",
                headers: asaasHeaders,
                body: JSON.stringify({
                    name,
                    email,
                    cpfCnpj: taxIdDigits,
                    mobilePhone: whatsapp ? whatsapp.replace(/\D/g, "") : undefined,
                    notificationDisabled: false,
                }),
            });

            if (!createCustomerResp.ok) {
                const errText = await createCustomerResp.text();
                console.error("Asaas create customer error:", errText);
                return new Response(
                    JSON.stringify({ error: "Erro ao criar cliente no gateway.", details: errText }),
                    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            const newCustomer = await createCustomerResp.json();
            customerId = newCustomer.id;
            console.log(`New Asaas customer created: ${customerId}`);
        }

        // ── STEP 2: Create subscription ────────────────────────────────────────
        const subscriptionResp = await fetch(`${asaasApiUrl}/subscriptions`, {
            method: "POST",
            headers: asaasHeaders,
            body: JSON.stringify({
                customer: customerId,
                billingType: "UNDEFINED", // Lets the payer choose PIX, Boleto, or Card
                value: plan.price,
                nextDueDate: getNextDueDate(),
                cycle: "MONTHLY",
                description: `Menu de Bordo — ${plan.name}`,
                externalReference: lead_id, // CRITICAL: used by webhook to find the lead
            }),
        });

        if (!subscriptionResp.ok) {
            const errText = await subscriptionResp.text();
            console.error("Asaas create subscription error:", errText);
            return new Response(
                JSON.stringify({ error: "Erro ao criar assinatura no gateway.", details: errText }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const subscriptionData = await subscriptionResp.json();
        const subscriptionId: string = subscriptionData.id;
        console.log(`Subscription created: ${subscriptionId}`);

        // ── STEP 3: Get invoice URL ───────────────────────────────────────────
        // The subscription creation response may contain the payment link directly,
        // but we use the robust strategy: fetch the first PENDING payment.
        let invoiceUrl: string | undefined = subscriptionData?.paymentLink;

        if (!invoiceUrl) {
            const paymentsResp = await fetch(
                `${asaasApiUrl}/subscriptions/${subscriptionId}/payments?status=PENDING&limit=1`,
                { headers: asaasHeaders }
            );

            if (paymentsResp.ok) {
                const paymentsData = await paymentsResp.json();
                const firstPayment = paymentsData?.data?.[0];

                // Prefer invoiceUrl (Asaas hosted page), fallback to bankSlipUrl, then billingLink
                invoiceUrl = firstPayment?.invoiceUrl ?? firstPayment?.bankSlipUrl ?? firstPayment?.billingLink;
                console.log(`Invoice URL from payment: ${invoiceUrl}`);
            } else {
                const errText = await paymentsResp.text();
                console.error("Error fetching subscription payments:", errText);
            }
        }

        if (!invoiceUrl) {
            console.error("No invoiceUrl found in subscription or payments response.");
            return new Response(
                JSON.stringify({ error: "URL de pagamento não retornada pelo gateway." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ── STEP 4: Update lead in Supabase ───────────────────────────────────
        const supabase = createClient(
            Deno.env.get("MAIN_SUPABASE_URL")!,
            Deno.env.get("MAIN_SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { error: dbError } = await supabase
            .from("leads")
            .update({
                asaas_customer_id: customerId,
                asaas_subscription_id: subscriptionId,
            })
            .eq("id", lead_id);

        if (dbError) console.error("DB Update Error:", dbError);

        console.log(`Checkout ready: lead=${lead_id}, customer=${customerId}, subscription=${subscriptionId}`);

        return new Response(
            JSON.stringify({ init_point: invoiceUrl, subscription_id: subscriptionId }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("Internal Error:", err);
        return new Response(
            JSON.stringify({ error: "Erro interno do servidor" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
