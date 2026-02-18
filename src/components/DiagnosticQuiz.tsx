import { useState } from 'react'
import './DiagnosticQuiz.css'

const QUESTIONS = [
    {
        id: 1,
        label: 'Pergunta 1: O Volume',
        question: 'Em um dia movimentado (sexta/sábado), quantos pedidos você recebe pelo WhatsApp?',
        options: [
            { id: 'a', text: 'Até 15 pedidos', subtitle: 'Tô começando' },
            { id: 'b', text: 'Entre 15 e 50 pedidos', subtitle: 'Movimento bom' },
            { id: 'c', text: 'Mais de 50 pedidos', subtitle: 'O celular não para' }
        ]
    },
    {
        id: 2,
        label: 'Pergunta 2: O Método',
        question: 'Como você processa esses pedidos hoje?',
        options: [
            { id: 'a', text: 'Anoto no papel/comanda e mando pra cozinha.' },
            { id: 'b', text: 'Copio do WhatsApp e colo em outro sistema/planilha.' },
            { id: 'c', text: 'O cliente pede por áudio ou texto solto e eu fico perguntando endereço, troco...' }
        ]
    },
    {
        id: 3,
        label: 'Pergunta 3: A Dor',
        question: 'Qual dessas situações te irrita mais hoje?',
        options: [
            { id: 'a', text: 'Cliente reclamando que a resposta demora.' },
            { id: 'b', text: 'Pedido saindo errado por falha de anotação.', subtitle: 'Com cebola, sem troco...' },
            { id: 'c', text: 'Pagar taxas altas para aplicativos de entrega (iFood, etc).' }
        ]
    }
]

const RESULTS: Record<string, { emoji: string; title: string; text: string; cta: string }> = {
    a: {
        emoji: '🚨',
        title: 'Diagnóstico: Você está perdendo até 10 horas por semana!',
        text: 'Baseado nas suas respostas, você gasta em média 3 a 5 minutos negociando cada pedido no WhatsApp. Em 50 pedidos, isso são quase 3 horas perdidas de um funcionário só digitando. Com nosso Cardápio Digital, o cliente gasta o tempo DELE montando o pedido. Para você, chega pronto em 0 segundos. Você ganha tempo para focar na qualidade do lanche.',
        cta: 'QUERO RECUPERAR MEU TEMPO COM O PLANO PRO'
    },
    b: {
        emoji: '⚠️',
        title: 'Diagnóstico: Seu prejuízo está nos erros manuais.',
        text: 'Anotar no papel ou confiar na memória gera erros. Um lanche que volta porque foi com o ingrediente errado é prejuízo dobrado (ingrediente + entrega + cliente insatisfeito). Nosso sistema de Impressão Automática elimina o "telefone sem fio". O que o cliente clica no celular sai impresso na cozinha. Zero erro de interpretação. Zero prejuízo.',
        cta: 'QUERO ELIMINAR ERROS COM A GESTÃO KANBAN'
    },
    c: {
        emoji: '💸',
        title: 'Diagnóstico: Você está trabalhando para os outros.',
        text: 'Você indicou que as taxas incomodam. Se você vende R$ 10.000 em apps de terceiros, você deixa na mesa até R$ 2.700 todo mês. Isso é quase o lucro líquido de uma empresa saudável. Com nosso Plano PRO, você paga R$ 100,00 fixos. Venda R$ 5 mil ou R$ 50 mil, o lucro é 100% seu. Fidelize o cliente no SEU canal, não no aplicativo do concorrente.',
        cta: 'QUERO ME LIVRAR DAS TAXAS AGORA'
    }
}

export default function DiagnosticQuiz() {
    const [step, setStep] = useState(0) // 0-2 = questions, 3 = loading, 4 = result
    const [answers, setAnswers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleAnswer = (optionId: string) => {
        const newAnswers = [...answers, optionId]
        setAnswers(newAnswers)

        if (step < 2) {
            setStep(step + 1)
        } else {
            setLoading(true)
            setStep(3)
            setTimeout(() => {
                setLoading(false)
                setStep(4)
            }, 2500)
        }
    }

    const resetQuiz = () => {
        setStep(0)
        setAnswers([])
        setLoading(false)
    }

    const resultKey = answers[2] || 'a'
    const result = RESULTS[resultKey]

    return (
        <section id="problema" className="section quiz-section">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title"> Sua lanchonete está perdendo dinheiro?</h2>
                    <p className="section-subtitle">Responda a 3 perguntas rápidas e descubra onde está o gargalo da sua operação.</p>
                </div>

                <div className="quiz-card">
                    {/* Progress Bar */}
                    {step < 3 && (
                        <div className="quiz-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }}></div>
                            </div>
                            <span className="progress-label">{step + 1} de 3</span>
                        </div>
                    )}

                    {/* Questions */}
                    {step < 3 && !loading && (
                        <div className="quiz-question">
                            <span className="question-label">{QUESTIONS[step].label}</span>
                            <h3 className="question-text">{QUESTIONS[step].question}</h3>
                            <div className="quiz-options">
                                {QUESTIONS[step].options.map((option) => (
                                    <button
                                        key={option.id}
                                        className="quiz-option"
                                        onClick={() => handleAnswer(option.id)}
                                    >
                                        <span className="option-letter">{option.id.toUpperCase()}</span>
                                        <div className="option-content">
                                            <span className="option-text">{option.text}</span>
                                            {option.subtitle && <span className="option-subtitle">{option.subtitle}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="quiz-loading">
                            <div className="loader-spinner"></div>
                            <p className="loader-text">Analisando sua operação com nossa IA...</p>
                        </div>
                    )}

                    {/* Result */}
                    {step === 4 && (
                        <div className="quiz-result">
                            <div className="result-emoji">{result.emoji}</div>
                            <h3 className="result-title">{result.title}</h3>
                            <p className="result-text">{result.text}</p>
                            <a href="#precos" className="btn btn-primary btn-lg">
                                👉 {result.cta}
                            </a>
                            <button className="quiz-restart" onClick={resetQuiz}>
                                ↻ Refazer diagnóstico
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
