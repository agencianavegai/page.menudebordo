import { Link } from 'react-router-dom'
import './Checkout.css'

export default function CheckoutSuccess() {
    return (
        <div className="checkout-split-page">
            <div className="checkout-split-container">

                {/* Lado Esquerdo - Info Principal e Upsell */}
                <div className="split-left-panel">
                    <div className="split-header-block">
                        <div className="success-icon-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h1>Quase lá!</h1>
                        <p>Seu pré-cadastro no Menu de Bordo foi concluído com sucesso.</p>
                    </div>

                    <div className="upsell-premium-card">
                        <div className="upsell-premium-icon">🚀</div>
                        <div className="upsell-premium-content">
                            <h3>Está sem tempo?</h3>
                            <p>Nossa equipe cadastra o cardápio completo para você e te entrega o sistema pronto para vender. Consulte taxas.</p>
                            <a
                                href="https://wa.me/5598985204721?text=Ol%C3%A1!%20Fiz%20meu%20pr%C3%A9-cadastro%20e%20gostaria%20de%20solicitar%20a%20montagem%20do%20meu%20card%C3%A1pio."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="upsell-premium-action"
                            >
                                Solicitar montagem via WhatsApp →
                            </a>
                        </div>
                    </div>

                    <Link to="/" className="back-link back-desktop">
                        ← Voltar para a página inicial
                    </Link>
                </div>

                {/* Lado Direito - Botoes de Ação */}
                <div className="split-right-panel">
                    <h2 className="action-panel-title">Como deseja prosseguir?</h2>

                    {/* Box 1: Pagou */}
                    <div className="action-box box-paid">
                        <div className="action-box-header">
                            <span className="status-badge paid-badge">Pagamento Efetuado</span>
                        </div>
                        <h3>Já realizou o pagamento?</h3>
                        <p>
                            Se você efetuou o pagamento do plano, acesse o link abaixo e crie sua conta no sistema usando o <strong>mesmo e-mail</strong> informado no formulário. Seu plano será ativado automaticamente.
                        </p>
                        <a href="https://menudebordo.vercel.app" className="action-button primary-action">
                            Acessar o Sistema e Criar Senha
                        </a>
                    </div>

                    {/* Box 2: Teste / Não pagou */}
                    <div className="action-box box-trial">
                        <div className="action-box-header">
                            <span className="status-badge trial-badge">Ainda em Dúvida?</span>
                        </div>
                        <h3>Teste 7 dias Grátis</h3>
                        <p>
                            Se você apenas preencheu o formulário e deseja ver se vale a pena, crie sua conta agora com o <strong>mesmo e-mail</strong> e libere 7 dias grátis sem compromisso para experimentar tudo.
                        </p>
                        <a href="https://menudebordo.vercel.app" className="action-button secondary-action">
                            Testar Gratuitamente por 7 Dias
                        </a>
                    </div>

                    <Link to="/" className="back-link back-mobile">
                        ← Voltar para a página inicial
                    </Link>
                </div>

            </div>
        </div>
    )
}
