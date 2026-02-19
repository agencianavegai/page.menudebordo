import { useState } from 'react'
import LeadFormModal from './LeadFormModal'
import './PricingSection.css'

export default function PricingSection() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    return (
        <>
            <section id="precos" className="section pricing-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Escolha o plano ideal para o seu momento</h2>
                        <p className="section-subtitle">Sem fidelidade. Sem taxas sobre vendas.</p>
                    </div>

                    <div className="pricing-grid">
                        {/* Plan 1 - Cardápio Digital */}
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3 className="plan-name">CARDÁPIO DIGITAL</h3>
                                <p className="plan-description">Para quem está começando agora</p>
                                <div className="plan-price-container">
                                    <div className="plan-price">
                                        <span className="currency">R$</span>
                                        <span className="amount">49,90</span>
                                        <span className="period">/ mês</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pricing-features">
                                <ul>
                                    <li className="included">✅ Cardápio Web Personalizável</li>
                                    <li className="included">✅ Recebimento do Pedido no WhatsApp (Texto)</li>
                                    <li className="included">✅ Alteração de Preços/Produtos Ilimitada</li>
                                    <li className="included">✅ Link Exclusivo da Loja</li>
                                    <li className="excluded">❌ Gestão de Pedidos (Painel)</li>
                                    <li className="excluded">❌ Relatórios de Vendas</li>
                                    <li className="excluded">❌ Mensagens Automáticas</li>
                                </ul>
                            </div>

                            <div className="pricing-footer">
                                <button
                                    onClick={() => setSelectedPlan('basic')}
                                    className="btn btn-secondary btn-full"
                                >
                                    ASSINAR BÁSICO
                                </button>
                                <p className="setup-fee">Acesso grátis ao PRO por 7 dias</p>
                            </div>
                        </div>

                        {/* Plan 2 - Gestão PRO */}
                        <div className="pricing-card popular">
                            <div className="popular-tag">RECOMENDADO</div>
                            <div className="pricing-header">
                                <h3 className="plan-name">GESTÃO PRO</h3>
                                <p className="plan-description">Para quem quer escala e organização</p>
                                <div className="plan-price-container">
                                    <div className="plan-price">
                                        <span className="currency">R$</span>
                                        <span className="amount">100,00</span>
                                        <span className="period">/ mês</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pricing-features">
                                <ul>
                                    <li className="included">✅ <strong>Tudo do Plano 1</strong></li>
                                    <li className="included">✅ Painel de Gestão Completo (Dashboard)</li>
                                    <li className="included">✅ Pedidos em Estilo Kanban (Arrasta e Solta)</li>
                                    <li className="included">✅ Atualização Automática de Status p/ Cliente</li>
                                    <li className="included">✅ Gestão de Promoções e Banners</li>
                                    <li className="included">✅ Impressão Térmica (Integração)</li>
                                    <li className="included">✅ Suporte Prioritário</li>
                                </ul>
                            </div>

                            <div className="pricing-footer">
                                <button
                                    onClick={() => setSelectedPlan('pro')}
                                    className="btn btn-primary btn-full animate-pulse"
                                >
                                    ASSINAR PRO
                                </button>
                                <p className="setup-fee">Gestão TOTAL do seu negócio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LeadFormModal
                isOpen={selectedPlan !== null}
                onClose={() => setSelectedPlan(null)}
                planId={selectedPlan || 'basic'}
            />
        </>
    )
}
