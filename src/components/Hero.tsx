import { useState, useEffect } from 'react'
import './Hero.css'

const HERO_IMAGES = [
    {
        src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=990&auto=format&fit=crop',
        alt: 'Hambúrguer artesanal delicioso'
    },
    {
        src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=990&auto=format&fit=crop',
        alt: 'Espetinho de churrasco na brasa'
    },
    {
        src: '/images/cachorro-quente-completo.webp',
        alt: 'Cachorro quente completo'
    },
    {
        src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=990&auto=format&fit=crop',
        alt: 'Pizza artesanal quentinha'
    },
    {
        src: '/images/acai-cremoso-com-frutas.webp',
        alt: 'Açaí cremoso com frutas'
    }
]

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 3500)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="hero section">
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Pare de anotar pedidos no papel e perder vendas por demora no WhatsApp.
                    </h1>
                    <p className="hero-subtitle">
                        Receba pedidos organizados, gerencie tudo em um painel profissional, atualize seu cliente pelo WhatsApp rapidamente e acompanhe o fluxo de caixa do seu negócio. <em>Sem compromisso. Começe HOJE.</em>
                    </p>
                    <div className="hero-badges">
                        <span className="badge">Sem taxas por venda</span>
                        <span className="badge">Sem aplicativos para baixar</span>
                    </div>

                    <div className="hero-cta-wrapper">
                        <a href="https://menudebordo.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg animate-pulse">
                            COMEÇAR MEU TESTE GRÁTIS HOJE
                        </a>
                        <p className="hero-guarantee">Cadastro em 2 minutos</p>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-image-wrapper animate-float">
                        {HERO_IMAGES.map((image, index) => (
                            <img
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                className={`hero-image ${index === currentImage ? 'active' : ''}`}
                            />
                        ))}
                        <div className="floating-card card-1">
                            <span>🍔</span> Pedidos Rápidos
                        </div>
                        <div className="floating-card card-2">
                            <span>🚀</span> +40% Vendas
                        </div>
                        <img
                            src="/images/hero-combo.png"
                            alt="Sistema em diversos dispositivos"
                            className="hero-floating-device"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
