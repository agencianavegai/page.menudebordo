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
    plan_id: string;
}

interface PlanConfig {
    title: string;
    price: number;
    reason: string;
}

const PLANS: Record<string, PlanConfig> = {
    basic: {
        title: "Cardápio Digital",
        price: 49.9,
        reason: "Plano Mensal - Cardápio Digital",
    },
    pro: {
        title: "Gestão PRO",
        price: 100.0,
        reason: "Plano Mensal - Gestão PRO",
    },
};

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body: CheckoutRequest = await req.json();
        const { lead_id, name, email, plan_id } = body;

        if (!lead_id || !name || !email || !plan_id) {
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

        const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
        if (!mpAccessToken) {
            console.error("Missing MP_ACCESS_TOKEN");
            return new Response(
                JSON.stringify({ error: "Erro: Gateway de pagamento não configurado." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // FIX: Robust back_url generation
        const envUrl = Deno.env.get("SITE_URL");
        let siteUrl = (envUrl && envUrl.startsWith("http"))
            ? envUrl
            : "https://menudebordo.vercel.app";

        siteUrl = siteUrl.replace(/\/$/, "");
        const back_url = `${siteUrl}/checkout/success`;
        const pending_url = `${siteUrl}/checkout/pending`;
        const failure_url = `${siteUrl}/checkout/error`;

        console.log(`Checkout initiated. Lead: ${lead_id}, Plan: ${plan_id}, BackUrl: ${back_url}`);

        const resp = await fetch("https://api.mercadopago.com/preapproval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mpAccessToken}`,
            },
            body: JSON.stringify({
                reason: plan.reason,
                external_reference: lead_id,
                payer_email: email,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: plan.price,
                    currency_id: "BRL",
                },
                back_url,
                status: "pending",
            }),
        });

        if (!resp.ok) {
            const errText = await resp.text();
            console.error("Mercado Pago API Error:", errText);
            return new Response(
                JSON.stringify({ error: "Erro na comunicação com operador de pagamento." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const data = await resp.json();

        const sbUrl = Deno.env.get("SUPABASE_URL")!;
        const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(sbUrl, sbKey);

        const { error: dbError } = await supabase
            .from("leads")
            .update({ mp_preference_id: data.id })
            .eq("id", lead_id);

        if (dbError) console.error("DB Update Error:", dbError);

        return new Response(
            JSON.stringify({ init_point: data.init_point, preapproval_id: data.id }),
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
