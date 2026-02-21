import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import ImageLightbox from './ImageLightbox'
import './VisualDemo.css'

const SCREENS = [
    {
        id: 1,
        title: '1. Cliente escolhe',
        description: 'Navegação intuitiva por categorias. Fotos grandes que despertam fome.',
        image: '/images/1.cliente-escolhe.jpg'
    },
    {
        id: 2,
        title: '2. Personaliza',
        description: 'Adicionais, observações e retirada de ingredientes. Tudo fácil.',
        image: '/images/2.personaliza.jpg'
    },
    {
        id: 3,
        title: '3. Envia p/ Zap',
        description: 'Pedido chega formatado e pronto para imprimir. Sem erros.',
        image: '/images/3.envia-p-zap.jpg'
    }
]

export default function VisualDemo() {
    const [activeScreen, setActiveScreen] = useState(0)
    const [lightboxImage, setLightboxImage] = useState<string | null>(null)

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
                            <div className="phone-screen-image-wrapper">
                                <img
                                    src={SCREENS[activeScreen].image}
                                    alt={SCREENS[activeScreen].title}
                                    className="screen-image animate-fade-in cursor-zoom-in"
                                    key={activeScreen}
                                    onClick={() => setLightboxImage(SCREENS[activeScreen].image)}
                                />
                                <div className="zoom-hint-badge">
                                    <ZoomIn size={14} />
                                    <span className="zoom-hint-text">Ampliar</span>
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

                        <div className="demo-cta-container">
                            <a
                                href="https://menudebordo.vercel.app/cozinhaferroquente"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="demo-cta-btn"
                            >
                                Faça um pedido teste 🍽️
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <ImageLightbox
                imageUrl={lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </section>
    )
}
