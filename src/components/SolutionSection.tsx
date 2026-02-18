import './SolutionSection.css'

export default function SolutionSection() {
    return (
        <section id="solucao" className="section solution-section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Tecnologia de Ponta para elevar o nivel do seu negócio</h2>
                    <p className="section-subtitle">Diferente dos apps de entrega, não cobramos % sobre suas vendas. Quanto mais você vende, mais você lucra.</p>
                </div>

                <div className="pillars-grid">
                    {/* Pillar 1 */}
                    <div className="pillar-card innovation">
                        <div className="pillar-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                <path d="M12 18h.01" />
                            </svg>
                        </div>
                        <h3>1. Cardápio Visual</h3>
                        <span className="pillar-tag">Inovação</span>
                        <p>Seu cliente clica no link, vê fotos lindas dos seus produtos e monta o pedido em segundos. Sem baixar app.</p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="pillar-card solution">
                        <div className="pillar-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-2.91a2.18 2.18 0 0 0-3.09-.09z" />
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                            </svg>
                        </div>
                        <h3>2. Pedido Pronto no Zap</h3>
                        <span className="pillar-tag">Solução</span>
                        <p>Chega de "oi, tem cardápio?". O pedido já chega completo com endereço, troco e observações no seu WhatsApp.</p>
                    </div>

                    {/* Pillar 3 - Updated */}
                    <div className="pillar-card integration">
                        <div className="pillar-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3v18h18" />
                                <path d="M18 17V9" />
                                <path d="M13 17V5" />
                                <path d="M8 17v-3" />
                            </svg>
                        </div>
                        <h3>3. Painel de Gestão</h3>
                        <span className="pillar-tag">Controle Total</span>
                        <p>Tenha visão completa do seu negócio. Controle entrada e saída de pedidos e acompanhe suas vendas em tempo real pelo Dashboard.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
