import { Link } from 'react-router-dom'
import './Checkout.css'

export default function CheckoutSuccess() {
    return (
        <div className="checkout-page">
            <div className="checkout-card success">
                <div className="checkout-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h1>Pagamento Confirmado!</h1>
                    <p>Vamos configurar seu restaurante.</p>
                </div>

                <div className="checkout-card-body">
                    <a
                        href="https://menudebordo.vercel.app"
                        className="checkout-primary-btn"
                    >
                        Criar Senha e Acessar Sistema
                    </a>

                    <div className="upsell-card">
                        <h3>⏰ Está sem tempo?</h3>
                        <p>Nossa equipe cadastra o cardápio para você!<br />Consulte taxas adicionais.</p>
                        <a
                            href="https://wa.me/5598985204721?text=Olá!%20Acabei%20de%20assinar%20e%20gostaria%20de%20solicitar%20a%20montagem%20do%20meu%20cardápio."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="upsell-btn"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.96 11.96 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.3 0-4.438-.758-6.152-2.04l-.43-.326-2.67.895.895-2.67-.326-.43A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                            Solicitar Montagem de Cardápio
                        </a>
                    </div>

                    <Link to="/" className="back-link">
                        ← Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    )
}
