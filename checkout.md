Atue como um Engenheiro de Software Full Stack Sênior e Product Manager.
Preciso implementar um fluxo completo de "Pré-Checkout" com captura de leads e assinatura para um SaaS de Cardápio Digital.

Abaixo estão as especificações técnicas (PRD) e regras de negócio. Siga rigorosamente a lógica descrita.

## 1. OBJETIVO DO FLUXO
Capturar os dados do cliente (Lead) *antes* dele pagar. Se ele abandonar o pagamento, já teremos os dados salvos para remarketing. O fluxo deve ser fluido e transparente.

## 2. ETAPA 1: Captura de Lead & Aceite Legal (Frontend)
**Local:** Modal ou Página `/assinar/dados`
**Ação do Usuário:** Clica no botão de plano escolhido (básico ou PRO).

**Requisitos de Interface (UI):**
1.  **Formulário:**
    * `Nome Completo` (Input texto)
    * `WhatsApp` (Input tel com máscara: (XX) XXXXX-XXXX)
    * `E-mail` (Input email com validação de formato)
2.  **Área Legal (Componente Crítico):**
    * Criar um checkbox: `[ ] Li e concordo com os Termos de Uso e Políticas de Privacidade.`
    * O texto "Termos de Uso e Políticas de Privacidade" deve ser um link/botão que abre um **Modal** contendo o texto legal (texto das politicas salvo na raiz do projeto nomeado como politicas.md).
3.  **Botão de Ação ("Ir para Pagamento"):**
    * **Estado Inicial:** DESABILITADO (Disabled).
    * **Lógica:** O botão só deve ser habilitado se o checkbox de aceite estiver marcado E os campos do formulário estiverem válidos.

**Requisitos de Backend (Lógica de Salvar):**
* Ao clicar no botão, envie os dados para o endpoint `POST /api/leads`.
* Salve no banco de dados com status `pending_payment`.
* **Regra de Ouro:** NÃO dispare nenhuma mensagem automática de WhatsApp/Email neste momento. Apenas salve os dados.

## 3. ETAPA 2: Integração com Pagamento (Checkout)
* Após o sucesso do salvamento do lead (response 200 OK), inicie a sessão de checkout com o Gateway (MercadoPago).
* **Pre-fill:** Passe o `email` do cliente para o checkout do gateway para ele não precisar digitar novamente.
* Redirecione o usuário para a URL de pagamento.

## 4. ETAPA 3: Pós-Pagamento (Retorno do Gateway)

### Cenário A: SUCESSO (`/checkout/success`)
Se o pagamento for aprovado (Webhook confirmou ou retorno success):
1.  Exibir Headline: "Pagamento Confirmado! Vamos configurar seu restaurante."
2.  Botão Principal: "Criar Senha e Acessar Sistema" (leva para o link menudebordo.vercel.app).
3.  **Feature de Upsell (Importante):**
    * Exibir um Card ou Alerta visualmente destacado:
    * "Está sem tempo? Nossa equipe cadastra o cardápio para você!"
    * Subtexto: "Consulte taxas adicionais."
    * Botão Secundário: "Solicitar Montagem de Cardápio" -> Link para WhatsApp do Suporte: `https://wa.me/5598985204721`.

### Cenário B: FALHA/CANCELAMENTO (`/checkout/error`)
Se o pagamento falhar ou o usuário cancelar:
1.  Exibir Headline: "Não foi possível concluir a transação."
2.  Botão Primário: "Tentar Pagar Novamente" (Reinicia o checkout com os dados já salvos).
3.  **Seção de Ajuda:**
    * Texto: "Teve problemas? Fale com nosso suporte agora."
    * Exibir número: **(98) 98520-4721**
    * Botão: "Chamar no WhatsApp" (Link direto).

## 5. DETALHES TÉCNICOS ADICIONAIS
* Utilize componentes reutilizáveis para o Modal de Termos.
* Garanta que o formulário seja responsivo (Mobile-first).
* Utilize validação de schema (ex: Zod) para garantir que o WhatsApp e E-mail sejam válidos antes de enviar ao banco.

Gere o código inicial para a **Etapa 1 (Componente do Formulário)** e a estrutura das rotas de sucesso/erro.