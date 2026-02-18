import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// MP sends: POST with header x-signature and body { type, data: { id } }
// Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Map MP preapproval status → our lead status
const STATUS_MAP: Record<string, string> = {
    authorized: "active",
    cancelled: "cancelled",
    paused: "cancelled",
    pending: "pending_payment",
};

Deno.serve(async (req: Request) => {
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
        const body = await req.json();
        const { type, data } = body;

        // Handle both possible event type names for subscriptions
        const SUBSCRIPTION_TYPES = ["preapproval", "subscription_preapproval"];
        if (!SUBSCRIPTION_TYPES.includes(type) || !data?.id) {
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const preapprovalId = data.id;
        const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");

        if (!mpAccessToken) {
            console.error("Missing MP_ACCESS_TOKEN");
            return new Response(JSON.stringify({ error: "Gateway não configurado" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fetch real status from MP API
        const mpResp = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
            headers: { Authorization: `Bearer ${mpAccessToken}` },
        });

        if (!mpResp.ok) {
            const errText = await mpResp.text();
            console.error("MP API error fetching preapproval:", errText);
            return new Response(JSON.stringify({ error: "Erro ao consultar MP" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const preapproval = await mpResp.json();
        const mpStatus: string = preapproval.status ?? "pending";
        const externalRef: string | undefined = preapproval.external_reference;
        const newStatus = STATUS_MAP[mpStatus] ?? "pending_payment";

        console.log(`Webhook: preapproval=${preapprovalId}, mp_status=${mpStatus}, lead_id=${externalRef}, new_status=${newStatus}`);

        if (!externalRef) {
            console.warn("No external_reference on preapproval, cannot update lead.");
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Update lead in Supabase
        const sbUrl = Deno.env.get("SUPABASE_URL")!;
        const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(sbUrl, sbKey);

        const { error: dbError } = await supabase
            .from("leads")
            .update({
                status: newStatus,
                mp_preference_id: preapprovalId,
            })
            .eq("id", externalRef);

        if (dbError) {
            console.error("DB update error:", dbError);
            // Return 200 anyway so MP doesn't keep retrying for a DB issue
        }

        // Send confirmation email only when payment is approved
        if (newStatus === "active") {
            const resendApiKey = Deno.env.get("RESEND_API_KEY");

            if (resendApiKey) {
                // Fetch lead data to get email and name
                const { data: lead, error: leadError } = await supabase
                    .from("leads")
                    .select("name, email, plan_id")
                    .eq("id", externalRef)
                    .single();

                if (leadError || !lead) {
                    console.error("Could not fetch lead for email:", leadError);
                } else {
                    const planNames: Record<string, string> = {
                        basic: "Cardápio Digital — R$ 49,90/mês",
                        pro: "Gestão PRO — R$ 100,00/mês",
                    };
                    const planLabel = planNames[lead.plan_id] ?? lead.plan_id;

                    const emailResp = await fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${resendApiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            from: "Menu de Bordo <noreply@navega.ai>",
                            to: [lead.email],
                            subject: "Bem-vindo ao Menu de Bordo! 🎉 Seu acesso está pronto.",
                            html: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0A1929;">
                                    <div style="background: #FF6B00; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                                        <h1 style="color: white; margin: 0; font-size: 24px;">Pagamento Confirmado! 🎉</h1>
                                    </div>
                                    <div style="background: #f8f9fa; padding: 32px; border-radius: 0 0 12px 12px;">
                                        <p style="font-size: 16px;">Olá, <strong>${lead.name}</strong>!</p>
                                        <p>Seu pagamento foi aprovado e sua assinatura está ativa.</p>
                                        <p><strong>Plano:</strong> ${planLabel}</p>
                                        <div style="text-align: center; margin: 32px 0;">
                                            <a href="https://menudebordo.vercel.app"
                                               style="background: #FF6B00; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
                                                Criar Senha e Acessar o Sistema →
                                            </a>
                                        </div>
                                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                                        <p style="font-size: 13px; color: #6b7280;">
                                            Dúvidas? Fale com nosso suporte: 
                                            <a href="https://wa.me/5598985204721" style="color: #FF6B00;">(98) 98520-4721</a>
                                        </p>
                                    </div>
                                </div>
                            `,
                        }),
                    });

                    if (!emailResp.ok) {
                        const emailErr = await emailResp.text();
                        console.error("Resend email error:", emailErr);
                    } else {
                        console.log(`Confirmation email sent to ${lead.email}`);
                    }
                }
            } else {
                console.warn("RESEND_API_KEY not set — skipping confirmation email.");
            }
        }

        return new Response(JSON.stringify({ received: true, lead_status: newStatus }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Internal error:", err);
        return new Response(JSON.stringify({ error: "Erro interno" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
