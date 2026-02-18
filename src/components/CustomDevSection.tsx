import './CustomDevSection.css'

const WHATSAPP_LINK =
    'https://wa.me/5598985204721?text=Ola,%20tenho%20interesse%20em%20uma%20solucao%20de%20software%20sob%20medida.'

const benefits = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        label: 'API Integrada',
        desc: 'Conecte com seus sistemas existentes via API RESTful robusta e documentada.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
        ),
        label: 'Marca Própria (White Label)',
        desc: 'Sua identidade visual, seu domínio, sua marca — tecnologia nossa.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        label: 'Painel Administrativo Exclusivo',
        desc: 'Dashboard personalizado com métricas e controles sob medida para seu negócio.',
    },
]

export default function CustomDevSection() {
    return (
        <section className="custom-dev" id="solucoes-corporativas">
            <div className="custom-dev__inner">
                <span className="custom-dev__badge">
                    <span className="custom-dev__badge-dot" aria-hidden="true" />
                    Soluções Corporativas &amp; White Label
                </span>

                <h2 className="custom-dev__title">
                    Gostou da nossa tecnologia?{' '}
                    <em>Crie o seu próprio ecossistema.</em>
                </h2>

                <p className="custom-dev__subtitle">
                    Desenvolvemos versões personalizadas deste sistema para sua agência,
                    franquia ou nicho específico. Tenha sua marca estampada em uma
                    tecnologia de ponta.
                </p>

                <div className="custom-dev__benefits">
                    {benefits.map((b) => (
                        <div className="custom-dev__benefit" key={b.label}>
                            <div className="custom-dev__benefit-icon" aria-hidden="true">
                                {b.icon}
                            </div>
                            <span className="custom-dev__benefit-label">{b.label}</span>
                            <span className="custom-dev__benefit-desc">{b.desc}</span>
                        </div>
                    ))}
                </div>

                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="custom-dev__cta"
                >
                    Cotar Projeto Personalizado
                    <span className="custom-dev__cta-arrow" aria-hidden="true">
                        →
                    </span>
                </a>
            </div>
        </section>
    )
}
