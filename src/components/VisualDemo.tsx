import { useState } from 'react'
import './VisualDemo.css'

const SCREENS = [
    {
        id: 1,
        title: '1. Cliente escolhe',
        description: 'Navegação intuitiva por categorias. Fotos grandes que despertam fome.',
        color: '#FF6B00',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
        ),
        type: 'mobile'
    },
    {
        id: 2,
        title: '2. Personaliza',
        description: 'Adicionais, observações e retirada de ingredientes. Tudo fácil.',
        color: '#0A1929',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        type: 'mobile'
    },
    {
        id: 3,
        title: '3. Envia p/ Zap',
        description: 'Pedido chega formatado e pronto para imprimir. Sem erros.',
        color: '#25D366',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        type: 'mobile'
    }
]

export default function VisualDemo() {
    const [activeScreen, setActiveScreen] = useState(0)

    return (
        <section id="demo" className="section demo-section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Veja como é fácil, prático e intuitivo</h2>
                    <p className="section-subtitle">A experiência de compra perfeita para o seu cliente</p>
                </div>

                <div className="demo-grid">
                    {/* Phone Mockup */}
                    <div className="phone-mockup-wrapper">
                        <div className="phone-frame">
                            <div className="phone-notch"></div>
                            <div className="phone-screen" style={{ backgroundColor: SCREENS[activeScreen].color }}>
                                <div className="screen-content">
                                    <div className="screen-icon animate-jump">{SCREENS[activeScreen].icon}</div>
                                    <h3>{SCREENS[activeScreen].title}</h3>
                                    <p className="screen-placeholder-text">
                                        Simulação da Tela do App
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls / Carousel */}
                    <div className="demo-controls">
                        {SCREENS.map((screen, index) => (
                            <div
                                key={screen.id}
                                className={`demo-step ${index === activeScreen ? 'active' : ''}`}
                                onClick={() => setActiveScreen(index)}
                            >
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <h3>{screen.title}</h3>
                                    <p>{screen.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
