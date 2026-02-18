import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <a href="#" className="navbar-logo">
                    Menu de Bordo <span>.</span>
                </a>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <a href="#problema" onClick={() => setMenuOpen(false)}>Por que usar?</a>
                    <a href="#solucao" onClick={() => setMenuOpen(false)}>Vantagens</a>
                    <a href="#demo" onClick={() => setMenuOpen(false)}>Demonstração</a>
                    <a href="#precos" onClick={() => setMenuOpen(false)}>Planos</a>
                    <a href="#faq" onClick={() => setMenuOpen(false)}>Dúvidas</a>
                    <a href="https://menudebordo.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mobile-only" onClick={() => setMenuOpen(false)}>
                        Teste Grátis
                    </a>
                </div>

                <div className="navbar-actions">
                    <a href="https://menudebordo.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary desktop-only">
                        Teste Grátis
                    </a>
                    <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    )
}
