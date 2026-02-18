import './AudienceCarousel.css'

const AUDIENCES = [
    '🍔 Hamburgueria',
    '🍕 Pizzaria',
    '🌭 Dogueria',
    '🍣 Japa & Sushi',
    '🥪 Lanchonete',
    '🍦 Açaiteria',
    '🧁 Confeitaria',
    '🥩 Churrascaria',
    '🥗 Marmitaria',
    '🍻 Espetinho',
    '🍟 Batataria',
    '🌮 Mexicano'
]

export default function AudienceCarousel() {
    return (
        <section className="audience-section">
            <div className="container text-center mb-4">
                <h3 className="audience-title">Ideal para o seu negócio:</h3>
            </div>

            <div className="carousel-track-container">
                <div className="carousel-track">
                    {/* Duplicate list 3 times to ensure smooth infinite loop */}
                    {[...AUDIENCES, ...AUDIENCES, ...AUDIENCES].map((item, index) => (
                        <div key={index} className="carousel-item">
                            <span className="audience-tag">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
