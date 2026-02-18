import './HowToTest.css'

const STEPS = [
    {
        id: 1,
        title: 'Liberação Imediata',
        description: 'Crie sua conta em poucos minutos, cadastre seus produtos e personalize seu cardápio digital.',
        type: 'mobile' as const,
        screenColor: '#FF6B00',
        screenIcon: '📱',
        screenLabel: 'Tela de Cadastro',
        screenDetails: ['Nome da Loja', 'Logo + Banner', 'Produtos + Fotos', 'Preços + Categorias']
    },
    {
        id: 2,
        title: 'Use na Prática',
        description: 'Divulgue o link do seu cardápio nas redes sociais e receba pedidos reais dos seus clientes.',
        type: 'mobile' as const,
        screenColor: '#25D366',
        screenIcon: '🔗',
        screenLabel: 'Compartilhe o Link',
        screenDetails: ['Link exclusivo da loja', 'QR Code para mesa', 'Compartilhe no WhatsApp', 'Receba pedidos reais']
    },
    {
        id: 3,
        title: 'Acompanhe Tudo',
        description: 'Acompanhe os pedidos chegando no Painel de Gestão e receba notificações no WhatsApp.',
        type: 'desktop' as const,
        screenColor: '#0A1929',
        screenIcon: '📊',
        screenLabel: 'Painel de Gestão',
        screenDetails: ['Kanban de Pedidos', 'Dashboard de Vendas', 'Notificação WhatsApp', 'Impressão Térmica']
    }
]

export default function HowToTest() {
    return (
        <section id="solucao" className="section howto-section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Teste GRÁTIS agora, veja como é fácil.</h2>
                    <p className="section-subtitle">Em 3 passos simples você já estará recebendo pedidos profissionalmente.</p>
                </div>

                <div className="howto-steps">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className={`howto-row ${index % 2 === 1 ? 'reverse' : ''}`}>
                            {/* Data Side */}
                            <div className="howto-data">
                                <div className="step-badge">{step.id}</div>
                                <h3 className="howto-step-title">{step.title}</h3>
                                <p className="howto-step-description">{step.description}</p>
                                <ul className="howto-checklist">
                                    {step.screenDetails.map((detail, i) => (
                                        <li key={i}>
                                            <span className="check-icon">✅</span> {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mockup Side */}
                            <div className="howto-mockup-wrapper">
                                <div className={`howto-device ${step.type === 'desktop' ? 'desktop-device' : 'phone-device'}`}>
                                    {step.type === 'mobile' && <div className="device-notch"></div>}
                                    <div className="device-screen" style={{ backgroundColor: step.screenColor }}>
                                        <div className="device-content">
                                            <span className="device-icon">{step.screenIcon}</span>
                                            <h4>{step.screenLabel}</h4>
                                            <div className="device-items">
                                                {step.screenDetails.map((detail, i) => (
                                                    <div key={i} className="device-item">
                                                        <div className="device-item-dot"></div>
                                                        <span>{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
