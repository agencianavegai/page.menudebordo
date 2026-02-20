import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DiagnosticQuiz from './components/DiagnosticQuiz'
import HowItWorksParallax from './components/HowItWorksParallax'
import AudienceCarousel from './components/AudienceCarousel'
import VisualDemo from './components/VisualDemo'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import CustomDevSection from './components/CustomDevSection'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutError from './pages/CheckoutError'
import CheckoutPending from './pages/CheckoutPending'

function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Detect return from Asaas checkout
    const checkoutComplete = sessionStorage.getItem('checkout_complete')
    if (checkoutComplete) {
      sessionStorage.removeItem('checkout_complete')
      sessionStorage.removeItem('checkout_init_point')
      // Navigate to the success/return page (unpaid/trial by default)
      // The webhook will update the DB; the success page shows both paths
      navigate('/checkout/success', { replace: true })
    }
  }, [navigate])

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <DiagnosticQuiz />
        <HowItWorksParallax />
        <AudienceCarousel />
        <VisualDemo />
        <PricingSection />
        <FAQSection />
      </main>
      <CustomDevSection />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/error" element={<CheckoutError />} />
      <Route path="/checkout/pending" element={<CheckoutPending />} />
    </Routes>
  )
}

export default App
