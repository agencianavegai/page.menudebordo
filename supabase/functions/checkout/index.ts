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
        price: 4990,
        description: "Plano Mensal — Cardápio Digital com gestão de pedidos via WhatsApp",
    },
    pro: {
        name: "Gestão PRO",
        price: 10000,
        description: "Plano Mensal — Gestão PRO com painel Kanban e notificações automáticas",
    },
};

const ABACATE_API = "https://api.abacatepay.com/v1";

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
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

        const abacateToken = Deno.env.get("ABACATEPAY_TOKEN");
        if (!abacateToken) {
            return new Response(
                JSON.stringify({ error: "Gateway de pagamento não configurado." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const siteUrl = (Deno.env.get("SITE_URL") ?? "https://menudebordonavegai.vercel.app").replace(/\/$/, "");

        const apiHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${abacateToken}`,
        };

        // Normalize taxId (digits only)
        const taxIdDigits = taxId.replace(/\D/g, "");

        // Build billing payload with inline customer
        const billingBody = {
            frequency: "MULTIPLE_PAYMENTS",
            methods: ["PIX", "CARD"],
            products: [
                {
                    externalId: `menu-de-bordo-${plan_id}-${lead_id.slice(0, 8)}`,
                    name: `Menu de Bordo — ${plan.name}`,
                    description: plan.description,
                    quantity: 1,
                    price: plan.price,
                },
            ],
            returnUrl: `${siteUrl}/checkout/error`,
            completionUrl: `${siteUrl}/checkout/success`,
            customer: {
                name,
                email,
                cellphone: whatsapp ?? "",
                taxId: taxIdDigits,
            },
        };

        console.log(`Creating billing for lead=${lead_id}, plan=${plan_id}, taxId=${taxIdDigits.slice(0, 3)}***`);

        const billingResp = await fetch(`${ABACATE_API}/billing/create`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify(billingBody),
        });

        const billingText = await billingResp.text();
        console.log(`AbacatePay billing response [${billingResp.status}]:`, billingText);

        if (!billingResp.ok) {
            return new Response(
                JSON.stringify({ error: "Erro ao criar cobrança no gateway de pagamento." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const billingData = JSON.parse(billingText);
        const billing = billingData?.data;
        const paymentUrl = billing?.url;

        if (!paymentUrl) {
            console.error("No payment URL in billing response:", billingText);
            return new Response(
                JSON.stringify({ error: "URL de pagamento não retornada pelo gateway." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Save billing ID to Supabase
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { error: dbError } = await supabase
            .from("leads")
            .update({ mp_preference_id: billing.id })
            .eq("id", lead_id);

        if (dbError) console.error("DB Update Error:", dbError);

        console.log(`Billing created: id=${billing.id}, url=${paymentUrl}`);

        return new Response(
            JSON.stringify({ init_point: paymentUrl, billing_id: billing.id }),
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
