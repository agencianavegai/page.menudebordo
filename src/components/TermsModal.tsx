import './TermsModal.css'

interface TermsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null

    return (
        <div className="terms-overlay" onClick={onClose}>
            <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
                <div className="terms-modal-header">
                    <h2>Política de Privacidade</h2>
                    <button className="terms-close-btn" onClick={onClose} aria-label="Fechar">
                        ×
                    </button>
                </div>

                <div className="terms-modal-body">
                    <h1>POLÍTICA DE PRIVACIDADE</h1>
                    <p><strong>Última atualização:</strong> 15 de fevereiro de 2026</p>

                    <p>
                        A sua privacidade é importante para o <strong>MENU DE BORDO</strong>. Esta
                        Política de Privacidade descreve como coletamos, usamos e protegemos as
                        informações pessoais que você nos fornece ao assinar nossos serviços.
                    </p>

                    <h2>1. DADOS COLETADOS</h2>
                    <p>
                        Para a criação da conta e processamento da assinatura, coletamos os seguintes
                        dados pessoais:
                    </p>
                    <ul>
                        <li>
                            <strong>Nome Completo:</strong> Para identificação do usuário.
                        </li>
                        <li>
                            <strong>Número de WhatsApp/Telefone:</strong> Para contato de suporte,
                            recuperação de conta e envio de notificações importantes.
                        </li>
                        <li>
                            <strong>E-mail:</strong> Para login, envio de comprovantes e comunicação
                            oficial.
                        </li>
                        <li>
                            <strong>CPF ou CNPJ:</strong> Necessário para emissão de nota fiscal e
                            processamento seguro do pagamento junto ao gateway Asaas, em conformidade
                            com a legislação fiscal brasileira.
                        </li>
                        <li>
                            <strong>Dados de Pagamento:</strong> Processados de forma criptografada
                            diretamente pelo nosso gateway de pagamento parceiro (Asaas). Não armazenamos
                            números completos de cartão de crédito.
                        </li>
                    </ul>

                    <h2>2. FINALIDADE DO USO DOS DADOS</h2>
                    <p>Utilizamos seus dados para:</p>
                    <ul>
                        <li>
                            <strong>Prestação do Serviço:</strong> Liberar o acesso ao sistema de
                            cardápio digital.
                        </li>
                        <li>
                            <strong>Marketing e Melhoria:</strong> Analisar o perfil de uso para melhorar
                            nossas ferramentas e enviar ofertas ou novidades (Remarketing) que possam ser
                            do seu interesse.
                        </li>
                        <li>
                            <strong>Segurança:</strong> Prevenir fraudes e garantir que os Termos de Uso
                            sejam cumpridos.
                        </li>
                    </ul>

                    <h2>3. COMPARTILHAMENTO DE DADOS</h2>
                    <p>
                        Não vendemos seus dados para terceiros. Compartilhamos informações apenas com:
                    </p>
                    <ul>
                        <li>
                            <strong>Processadores de Pagamento:</strong> Para efetivar a cobrança da
                            assinatura.
                        </li>
                        <li>
                            <strong>Autoridades Legais:</strong> Caso sejamos obrigados por lei ou ordem
                            judicial.
                        </li>
                    </ul>

                    <h2>4. SEUS DIREITOS (LGPD)</h2>
                    <p>
                        Você tem o direito de solicitar o acesso, correção ou exclusão dos seus dados
                        pessoais de nossa base de marketing a qualquer momento, entrando em contato com
                        nosso suporte. Note que alguns dados precisam ser mantidos por lei para
                        registros fiscais.
                    </p>

                    <h2>5. CONTATO</h2>
                    <p>
                        Para questões sobre privacidade, entre em contato pelo WhatsApp:{' '}
                        <strong>(98) 98520-4721</strong>.
                    </p>
                </div>

                <div className="terms-modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Entendi e Concordo
                    </button>
                </div>
            </div>
        </div>
    )
}
