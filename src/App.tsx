import { Routes, Route } from 'react-router-dom'
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
