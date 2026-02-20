import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Asaas Webhook Handler
// Docs: https://docs.asaas.com/reference/webhooks
// Events: PAYMENT_CONFIRMED, PAYMENT_RECEIVED → update lead status to 'paid'

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type, asaas-access-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
        // ── Security: validate webhook token ──────────────────────────────────
        const webhookToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
        const incomingToken = req.headers.get("asaas-access-token");

        if (webhookToken && incomingToken !== webhookToken) {
            console.warn("Asaas webhook: invalid token received.");
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const body = await req.json();
        const { event, payment } = body;

        console.log(`Asaas webhook received: event=${event}`);

        // Only handle confirmed/received payments
        if (!["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"].includes(event)) {
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!payment) {
            console.warn("Webhook payload missing 'payment' object.");
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // ── Find lead via externalReference ───────────────────────────────────
        // Asaas puts externalReference on the subscription; the payment may inherit it.
        let leadId: string | undefined = payment.externalReference ?? undefined;

        // Fallback: if externalReference is absent on the payment, fetch the subscription
        if (!leadId && payment.subscription) {
            const asaasApiUrl = Deno.env.get("ASAAS_API_URL");
            const asaasApiKey = Deno.env.get("ASAAS_API_KEY");

            if (asaasApiUrl && asaasApiKey) {
                const subResp = await fetch(`${asaasApiUrl}/subscriptions/${payment.subscription}`, {
                    headers: { "access_token": asaasApiKey, "Content-Type": "application/json" },
                });

                if (subResp.ok) {
                    const subData = await subResp.json();
                    leadId = subData.externalReference ?? undefined;
                    console.log(`Got externalReference from subscription: ${leadId}`);
                } else {
                    console.error("Failed to fetch subscription:", await subResp.text());
                }
            }
        }

        if (!leadId) {
            console.warn("Cannot identify lead — no externalReference in payment or subscription.");
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // ── Update lead status ─────────────────────────────────────────────────
        const { error: dbError } = await supabase
            .from("leads")
            .update({ status: "paid" })
            .eq("id", leadId);

        if (dbError) {
            console.error("DB update error:", dbError);
        } else {
            console.log(`Lead ${leadId} updated to 'paid'.`);
        }

        // ── Send confirmation email via Resend ─────────────────────────────────
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
            const { data: lead, error: leadError } = await supabase
                .from("leads")
                .select("name, email, plan_id")
                .eq("id", leadId)
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
                    console.error("Resend email error:", await emailResp.text());
                } else {
                    console.log(`Confirmation email sent to ${lead.email}`);
                }
            }
        } else {
            console.warn("RESEND_API_KEY not set — skipping confirmation email.");
        }

        return new Response(JSON.stringify({ received: true, lead_status: "paid" }), {
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
