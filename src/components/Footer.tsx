import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer section bg-secondary text-white">
            <div className="container text-center">
                <h2 className="footer-title">
                    Sua cozinha mais organizada e seu cliente mais feliz hoje mesmo.
                </h2>

                <div className="footer-cta-wrapper">
                    <a href="https://wa.me/5598985204721" target="_blank" className="btn btn-primary btn-lg animate-pulse">
                        👉 FALAR COM ESPECIALISTA E TESTAR AGORA
                    </a>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Menu de Bordo. Todos os direitos reservados.</p>
                    <p className="footer-credits">
                        Desenvolvido por <a href="mailto:agencianavegai@gmail.com">Agência Navega.ai</a>
                    </p>
                    <p className="footer-credits">agencianavegai@gmail.com</p>
                </div>
            </div>
        </footer>
    )
}
