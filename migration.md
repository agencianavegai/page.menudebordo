Atue como um Engenheiro de Software Arquiteto e Especialista em Supabase.

Acabámos de tomar uma decisão arquitetural importante: vamos usar uma única base de dados (a do Sistema Principal) tanto para a Landing Page como para o Sistema em si. A Landing Page agora atua apenas como um "cliente" que escreve na base de dados do Sistema.

**Tarefa 1: Migração da Tabela de Leads**
Gere o código SQL para eu correr no SQL Editor do **Sistema Principal**.
Precisamos de criar a tabela `leads` lá, com a seguinte estrutura:
- `id` (uuid, primary key)
- `created_at` (timestamp)
- `name` (text)
- `email` (text)
- `whatsapp` (text)
- `cpf_cnpj` (text)
- `status` (text, default 'pending_payment')
- `asaas_customer_id` (text, nullable)
- `asaas_subscription_id` (text, nullable)
- `auth_user_id` (uuid, nullable) - Para vincular ao utilizador quando ele criar a conta.

**Tarefa 2: Refatorização do Fluxo de Pagamento (Landing Page)**
Verifique o ficheiro de submissão do formulário da Landing Page (ex: `/api/checkout` ou Server Action).
Certifique-se de que a inserção de dados via Supabase Client está a utilizar as variáveis de ambiente atuais (que agora apontam para o Sistema Principal).
* Lógica: Quando o utilizador clica em "Assinar", os dados vão diretamente para a tabela `leads` do Sistema Principal. O link de pagamento do Asaas é gerado e o utilizador é redirecionado.

**Tarefa 3: Ajuste do Webhook (Sistema Principal)**
O Webhook do Asaas (`/api/webhooks/asaas`) deve agora residir no repositório do **Sistema Principal**, pois é lá que os dados dos restaurantes e utilizadores vivem.
Escreva o código do Webhook com a seguinte lógica para o evento `PAYMENT_CONFIRMED`:
1. Identifica o pagamento e extrai o `externalReference` (que é o ID do lead) ou o `email`/`cpfCnpj`.
2. Atualiza a tabela `leads` marcando `status` = 'paid'.
3. **Automação de Acesso:** Verifica se já existe um registo deste cliente na tabela de inquilinos/restaurantes (ex: `restaurants` ou `profiles`).
   - Se existir: Atualiza a coluna `expires_at` somando +30 dias e define `status` = 'active'.
   - Se NÃO existir: Apenas regista o pagamento. Quando o cliente fizer o login/registo inicial e criar a conta, o sistema lerá a tabela `leads` (que já está 'paid') e dar-lhe-á os 30 dias de imediato em vez dos 7 dias de teste.

Forneça o SQL e o código atualizado do Webhook.