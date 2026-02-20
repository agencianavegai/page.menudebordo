Atue como um Engenheiro de Backend Sênior Especialista em Integração Asaas (API v3).

Vamos implementar a rota `/api/checkout` utilizando o **Asaas** para criar assinaturas recorrentes.

**Stack:** Next.js App Router + Supabase + Axios (para requisições HTTP).

**Pré-requisitos:**
* Adicionar campo `cpf_cnpj` no Schema de validação (Zod) e na tabela `leads` do Supabase. O Asaas EXIGE este campo.

**Lógica da Rota (`POST /api/checkout`):**

1.  **Recuperar/Criar Cliente no Asaas:**
    * Receba `name`, `email`, `cpfCnpj`, `mobilePhone` (Whatsapp) do frontend.
    * Primeiro, consulte a API do Asaas (`GET /api/v3/customers?cpfCnpj={cpf}`) para ver se o cliente já existe.
    * Se existir, pegue o `id` dele.
    * Se não, crie o cliente (`POST /api/v3/customers`).

2.  **Criar a Assinatura (Subscription):**
    * Endpoint: `POST /api/v3/subscriptions`
    * Payload:
        * `customer`: ID do cliente recuperado acima.
        * `billingType`: 'UNDEFINED' (Isso permite que o cliente escolha PIX, Boleto ou Cartão na tela de pagamento do Asaas).
        * `value`: Valor do plano (ex: 97.00).
        * `nextDueDate`: Data de hoje (para cobrar imediatamente).
        * `cycle`: 'MONTHLY'.
        * `description`: "Assinatura Cardápio Digital".
        * `externalReference`: O UUID do lead no Supabase (CRÍTICO para o webhook).

3.  **Obter o Link de Pagamento:**
    * Ao criar a assinatura, o Asaas gera a primeira cobrança automaticamente.
    * Geralmente o retorno da criação da assinatura não traz o link direto da fatura *imediatamente* em alguns casos, ou traz.
    * **Estratégia Robusta:** Se o payload de resposta da assinatura não tiver uma URL de pagamento direta, faça uma chamada ao endpoint de listagem de cobranças dessa assinatura (`GET /api/v3/subscriptions/{id}/payments`) para pegar a primeira cobrança pendente (`PENDING`) e extrair a `invoiceUrl`.

4.  **Retorno:**
    * Retorne a `invoiceUrl` para o frontend redirecionar o usuário.
    * Atualize o lead no Supabase salvando o `asaas_customer_id` e `asaas_subscription_id`.

**Importante:** Use variáveis de ambiente `ASAAS_API_URL` (sandbox ou prod) e `ASAAS_API_KEY`.

Gere o código completo desta API Route.