Atue como um Engenheiro de Backend Especialista em Node.js, Supabase e Mercado Pago SDK.

Agora vamos implementar a lógica de backend para o fluxo de checkout que desenhamos.
Stack: Next.js (API Routes ou Server Actions), Supabase (Postgres) e Mercado Pago.

### 1. Banco de Dados (Supabase)
Primeiro, gere o SQL para criar a tabela de leads.
* Nome da tabela: `leads`
* Colunas:
    * `id` (uuid, primary key, default gen_random_uuid())
    * `created_at` (timestamptz, default now())
    * `name` (text, not null)
    * `whatsapp` (text, not null)
    * `email` (text, not null)
    * `status` (text, default 'pending_payment') -- status possíveis: pending_payment, paid, cancelled
    * `mp_preference_id` (text, nullable) -- para salvar o ID da preferência do MP
* Adicione uma política RLS (Row Level Security) simples permitindo insert público (anon key) para que o formulário funcione, mas select apenas para admin.

### 2. Integração Mercado Pago (API Route)
Crie um endpoint (ex: `/api/checkout`) que receba os dados do formulário (`name`, `email`, `whatsapp`, `plan_id`).

**Lógica do Endpoint:**
1.  **Validação:** Valide os dados de entrada (Zod).
2.  **Persistência:** Salve o lead no Supabase na tabela `leads` com status 'pending_payment'. Recupere o `id` gerado (UUID).
3.  **Criação de Preferência (Mercado Pago):**
    * Instancie o `mercadopago` SDK.
    * Crie uma preferência de pagamento.
    * **Item:** Defina o item com base no `plan_id` (Ex: "Assinatura Cardápio Digital").
    * **Payer:** Preencha `name` e `email` do payer com os dados do lead (para evitar redigitação no checkout).
    * **External Reference:** IMPORTANTE: Coloque o `id` (UUID) do lead do Supabase no campo `external_reference`. Isso servirá para conciliar o pagamento depois via Webhook.
    * **Back URLs:** Configure as rotas de retorno:
        * Success: `[SEU_DOMINIO]/checkout/success`
        * Failure: `[SEU_DOMINIO]/checkout/error`
        * Pending: `[SEU_DOMINIO]/checkout/error`
    * **Auto Return:** Defina como 'approved' (para o usuário voltar automaticamente para o seu site após pagar).
4.  **Atualização:** Atualize o registro no Supabase salvando o `preference.id` gerado.
5.  **Retorno:** Retorne a URL de checkout (`init_point`) para o frontend fazer o redirecionamento.

### 3. Tratamento de Erros
* Adicione blocos try/catch robustos.
* Se falhar ao criar no Mercado Pago, não deixe o lead "morto" no banco sem aviso, retorne erro 500 para o front.

Gere o código SQL e o código da API Route (Next.js App Router).