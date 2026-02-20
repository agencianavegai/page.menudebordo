Atue como um Engenheiro de Backend.
Preciso do Webhook para ouvir eventos do Asaas (`/api/webhooks/asaas`).

**Lógica de Segurança e Atualização:**

1.  **Evento:** Escute eventos do tipo `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`.
2.  **Segurança:** Verifique se o header `asaas-access-token` corresponde ao token que definiremos no painel do Asaas (opcional, mas recomendado).
3.  **Processamento:**
    * O payload do webhook traz o objeto `payment`.
    * Dentro de `payment`, procure por `externalReference`. **Atenção:** Se a externalReference não vier no objeto de pagamento, busque-a consultando a assinatura (`subscription`) associada a esse pagamento.
    * (Dica: No passo anterior, definimos a `externalReference` na Assinatura. O pagamento herda isso ou podemos buscar o lead pelo ID da assinatura).
4.  **Ação no Banco:**
    * Atualize a tabela `leads` no Supabase: `status` = 'paid'.

Gere o código do Webhook.