import './ProblemSection.css'

export default function ProblemSection() {
    return (
        <section id="problema" className="section problem-section">
            <div className="container">
                <div className="problem-header text-center">
                    <h2 className="section-title">Você se identifica com esse caos?</h2>
                    <p className="section-subtitle">O atendimento manual está sangrando o seu lucro.</p>
                </div>

                <div className="problem-grid">
                    <div className="problem-card">
                        <div className="problem-icon">❌</div>
                        <h3>Cliente esperando</h3>
                        <p>Você demora 10 minutos para responder e ele desiste de comprar.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">❌</div>
                        <h3>Erros bobos</h3>
                        <p>O funcionário esquece de tirar a cebola ou anota o endereço errado.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">❌</div>
                        <h3>Taxas abusivas</h3>
                        <p>Você vende bem, mas deixa 15% a 27% do seu lucro para os aplicativos.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">❌</div>
                        <h3>Atendimento lento</h3>
                        <p>Sua equipe perde tempo digitando "Oi, boa noite" 100 vezes por dia.</p>
                    </div>
                </div>

                <div className="impact-phrase-wrapper">
                    <p className="impact-phrase">
                        "Atender mal no WhatsApp é o jeito mais rápido de mandar seu cliente para o concorrente."
                    </p>
                </div>
            </div>
        </section>
    )
}
