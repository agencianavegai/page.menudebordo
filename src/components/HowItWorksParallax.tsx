import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import {
  Check, Store, Image, Tag, Layers,
  Link, QrCode, Share2, ShoppingBag,
  LayoutDashboard, BarChart3, Bell, Printer, ZoomIn
} from 'lucide-react'
import ImageLightbox from './ImageLightbox'
import './HowItWorksParallax.css'

interface StepData {
  id: number
  badge: string
  title: string
  description: string
  type: 'phone' | 'desktop'
  checklist: { icon: React.ReactNode; text: string }[]
  images: string[]
}

const STEPS: StepData[] = [
  {
    id: 1,
    badge: 'Etapa 1',
    title: 'Liberação Imediata',
    description:
      'Crie sua conta em poucos minutos, cadastre seus produtos e personalize seu cardápio digital.',
    type: 'phone',
    checklist: [
      { icon: <Store size={14} />, text: 'Nome da Loja' },
      { icon: <Image size={14} />, text: 'Logo + Banner' },
      { icon: <Tag size={14} />, text: 'Produtos + Fotos' },
      { icon: <Layers size={14} />, text: 'Preços + Categorias' },
    ],
    images: ['/images/etapa1.1.jpg', '/images/etapa1.2.jpg'],
  },
  {
    id: 2,
    badge: 'Etapa 2',
    title: 'Use na Prática',
    description:
      'Divulgue o link do seu cardápio nas redes sociais e receba pedidos reais dos seus clientes.',
    type: 'phone',
    checklist: [
      { icon: <Link size={14} />, text: 'Link exclusivo' },
      { icon: <QrCode size={14} />, text: 'QR Code para mesa' },
      { icon: <Share2 size={14} />, text: 'Compartilhe nas redes sociais' },
      { icon: <ShoppingBag size={14} />, text: 'Receba pedidos reais' },
    ],
    images: ['/images/etapa2.1.jpg', '/images/etapa2.2.jpg'],
  },
  {
    id: 3,
    badge: 'Etapa 3',
    title: 'Acompanhe Tudo',
    description:
      'Acompanhe os pedidos chegando no Painel de Gestão e receba notificações no WhatsApp.',
    type: 'desktop',
    checklist: [
      { icon: <LayoutDashboard size={14} />, text: 'Kanban de Pedidos' },
      { icon: <BarChart3 size={14} />, text: 'Dashboard de Vendas' },
      { icon: <Bell size={14} />, text: 'Notificação WhatsApp' },
      { icon: <Printer size={14} />, text: 'Impressão Térmica' },
    ],
    images: ['/images/etapa3.1.jpg', '/images/etapa3.2.jpg'],
  },
]

const TEST_URL = 'https://menudebordo.vercel.app'

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

function StepPanel({
  step,
  progress,
}: {
  step: StepData
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const y = useTransform(progress, [0, 0.15, 0.85, 1], [60, 0, 0, -60])

  return (
    <div className="hiw-parallax__step">
      <motion.div className="hiw-parallax__step-inner" style={{ opacity, y }}>
        <span className="hiw-parallax__step-badge">{step.badge}</span>
        <h3 className="hiw-parallax__step-title">{step.title}</h3>
        <p className="hiw-parallax__step-desc">{step.description}</p>
        <ul className="hiw-parallax__checklist">
          {step.checklist.map((item) => (
            <li key={item.text}>
              <span className="hiw-parallax__check-icon">
                <Check size={13} strokeWidth={3} />
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default function HowItWorksParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [activeStep, setActiveStep] = useState(0)
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Desktop: derive step & image from scroll
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (isMobile) return
    let newStep = 0
    if (v >= 0.66) newStep = 2
    else if (v >= 0.33) newStep = 1
    setActiveStep(newStep)
    const stepStart = newStep * 0.33
    const stepMid = stepStart + 0.165
    setActiveImg(v >= stepMid ? 1 : 0)
  })

  // Step progress for text animation (desktop only)
  const step1Progress = useTransform(scrollYProgress, [0, 0.33], [0, 1])
  const step2Progress = useTransform(scrollYProgress, [0.33, 0.66], [0, 1])
  const step3Progress = useTransform(scrollYProgress, [0.66, 1], [0, 1])
  const stepProgresses = [step1Progress, step2Progress, step3Progress]

  // Device morph: phone → desktop (desktop only)
  const deviceWidth = useTransform(
    scrollYProgress, [0, 0.55, 0.72, 1], [280, 280, 520, 520]
  )
  const deviceRadius = useTransform(
    scrollYProgress, [0, 0.55, 0.72, 1], [32, 32, 12, 12]
  )
  const devicePadding = useTransform(
    scrollYProgress, [0, 0.55, 0.72, 1], [12, 12, 8, 8]
  )
  const screenAspect = useTransform(
    scrollYProgress, [0, 0.55, 0.72, 1], [0.5625, 0.5625, 1.6, 1.6]
  )
  const notchOpacity = useTransform(scrollYProgress, [0.55, 0.65], [1, 0])
  const topbarOpacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1])
  const screenRadius = useTransform(
    scrollYProgress, [0, 0.55, 0.72, 1], [20, 20, 4, 4]
  )

  const currentStep = STEPS[activeStep]

  // Mobile: use IntersectionObserver on cards to update step
  const handleMobileStepVisible = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex)
    setActiveImg(0)
    // Auto-cycle to image 2 after 2s
    const timer = setTimeout(() => setActiveImg(1), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="solucao" className="hiw-parallax">
      <div className="hiw-parallax__header">
        <h2>Teste GRÁTIS agora, veja como é fácil.</h2>
        <p>
          Em 3 passos simples você já estará recebendo pedidos
          profissionalmente.
        </p>
      </div>

      {/* Desktop layout */}
      {!isMobile && (
        <div ref={containerRef} className="hiw-parallax__scroll-area">
          <div className="hiw-parallax__container">
            <div className="hiw-parallax__steps">
              {STEPS.map((step, index) => (
                <StepPanel
                  key={step.id}
                  step={step}
                  progress={stepProgresses[index]}
                />
              ))}
            </div>

            <div className="hiw-parallax__device-col">
              <div className="hiw-parallax__device-sticky">
                <motion.div
                  className="hiw-device"
                  style={{
                    width: deviceWidth,
                    borderRadius: deviceRadius,
                    padding: devicePadding,
                  }}
                >
                  <motion.div
                    className="hiw-device__notch"
                    style={{ opacity: notchOpacity }}
                  />
                  <motion.div
                    className="hiw-device__topbar"
                    style={{ opacity: topbarOpacity }}
                  >
                    <div className="hiw-device__topbar-dot" />
                    <div className="hiw-device__topbar-dot" />
                    <div className="hiw-device__topbar-dot" />
                  </motion.div>

                  <motion.div
                    className="hiw-device__screen"
                    style={{
                      aspectRatio: screenAspect,
                      borderRadius: screenRadius,
                    }}
                  >
                    <img
                      key={`${activeStep}-${activeImg}`}
                      src={currentStep.images[activeImg]}
                      alt={`${currentStep.title} - tela ${activeImg + 1}`}
                      className="hiw-device__img hiw-device__img--fade cursor-zoom-in"
                      onClick={() => setLightboxImage(currentStep.images[activeImg])}
                    />
                    <div className="zoom-hint-badge">
                      <ZoomIn size={14} />
                      <span className="zoom-hint-text">Ampliar</span>
                    </div>
                  </motion.div>

                  <div className="hiw-device__dots">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`hiw-device__dot ${i === activeStep ? 'hiw-device__dot--active' : ''}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile layout */}
      {isMobile && (
        <div className="hiw-parallax__mobile-layout">
          <div className="hiw-parallax__mobile-device-sticky">
            <div
              className={`hiw-device hiw-device--mobile ${currentStep.type === 'desktop' ? 'hiw-device--mobile-desktop' : ''}`}
            >
              <div className="hiw-device__notch" style={{ opacity: currentStep.type === 'desktop' ? 0 : 1 }} />

              {/* Desktop Topbar for mobile */}
              <div
                className="hiw-device__topbar"
                style={{
                  opacity: currentStep.type === 'desktop' ? 1 : 0,
                  display: currentStep.type === 'desktop' ? 'flex' : 'none'
                }}
              >
                <div className="hiw-device__topbar-dot" />
                <div className="hiw-device__topbar-dot" />
                <div className="hiw-device__topbar-dot" />
              </div>

              <div
                className="hiw-device__screen"
                style={{
                  borderRadius: currentStep.type === 'desktop' ? 4 : 20,
                  aspectRatio: currentStep.type === 'desktop' ? '1.6' : '9/16'
                }}
              >
                <img
                  key={`m-${activeStep}-${activeImg}`}
                  src={currentStep.images[activeImg]}
                  alt={`${currentStep.title} - tela ${activeImg + 1}`}
                  className="hiw-device__img hiw-device__img--fade cursor-zoom-in"
                  onClick={() => setLightboxImage(currentStep.images[activeImg])}
                />
                <div className="zoom-hint-badge">
                  <ZoomIn size={14} />
                  <span className="zoom-hint-text">Ampliar</span>
                </div>
              </div>
              <div className="hiw-device__dots">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`hiw-device__dot ${i === activeStep ? 'hiw-device__dot--active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hiw-parallax__mobile-cards">
            {STEPS.map((step, index) => (
              <MobileCard
                key={step.id}
                step={step}
                index={index}
                isActive={index === activeStep}
                onVisible={handleMobileStepVisible}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="hiw-parallax__cta-wrapper">
        <a
          href={TEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg hiw-parallax__cta"
        >
          Clique aqui e conquiste o seu teste grátis
        </a>
      </div>

      <ImageLightbox
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  )
}

function MobileCard({
  step,
  index,
  isActive,
  onVisible,
}: {
  step: StepData
  index: number
  isActive: boolean
  onVisible: (i: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(index)
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index, onVisible])

  return (
    <div
      ref={ref}
      className={`hiw-parallax__mobile-card ${isActive ? 'hiw-parallax__mobile-card--active' : ''}`}
    >
      <span className="hiw-parallax__step-badge">{step.badge}</span>
      <h3 className="hiw-parallax__step-title">{step.title}</h3>
      <p className="hiw-parallax__step-desc">{step.description}</p>
      <ul className="hiw-parallax__checklist">
        {step.checklist.map((item) => (
          <li key={item.text}>
            <span className="hiw-parallax__check-icon">
              <Check size={13} strokeWidth={3} />
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
