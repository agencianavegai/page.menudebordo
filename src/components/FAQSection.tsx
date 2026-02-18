import { useState } from 'react'
import './FAQSection.css'

const FAQS = [
    {
        question: 'Preciso comprar computador?',
        answer: 'Não! O Plano Inicial roda 100% no seu celular. O Plano PRO recomenda um PC ou Tablet para gerenciar os pedidos com mais conforto.'
    },
    {
        question: 'Vocês cobram taxa por pedido?',
        answer: 'Zero. Se você vender R$ 1.000 ou R$ 100.000, o valor que você paga para nós é o mesmo da mensalidade fixa. Sem surpresas.'
    },
    {
        question: 'E se eu quiser cancelar?',
        answer: 'Sem problemas. Não temos fidelidade. Você cancela quando quiser, sem multas (basta avisar 15 dias antes).'
    },
    {
        question: 'Consigo mudar os preços sozinho?',
        answer: 'Sim! Você terá um acesso administrativo para mudar preços, fotos e pausar produtos que acabaram no estoque em tempo real.'
    },
    {
        question: 'Depois de 7 dias, perco meus dados?',
        answer: 'Não! Seus produtos e cadastro ficam salvos. O sistema apenas bloqueia a entrada de novos pedidos até você escolher um plano.'
    },
    {
        question: 'Como funciona o pagamento?',
        answer: 'Usamos o Mercado Pago. É uma assinatura mensal (estilo Netflix) que debita no cartão ou gera o PIX todo mês para você não esquecer e o sistema não parar.'
    }
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section id="faq" className="section faq-section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Dúvidas Frequentes</h2>
                    <p className="section-subtitle">Tudo o que você precisa saber antes de começar.</p>
                </div>

                <div className="faq-list">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
