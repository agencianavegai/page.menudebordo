import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { PLANS } from '../lib/plans'
import { leadSchema, formatWhatsApp, formatCpfCnpj, type LeadFormData } from '../lib/validation'
import TermsModal from './TermsModal'
import './LeadFormModal.css'

interface LeadFormModalProps {
    isOpen: boolean
    onClose: () => void
    planId: string
}

export default function LeadFormModal({ isOpen, onClose, planId }: LeadFormModalProps) {
    const plan = PLANS[planId]
    const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', taxId: '' })
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [showTerms, setShowTerms] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => { mountedRef.current = false }
    }, [])

    if (!isOpen || !plan) return null

    const handleWhatsAppChange = (value: string) => {
        setFormData((prev) => ({ ...prev, whatsapp: formatWhatsApp(value) }))
    }

    const handleTaxIdChange = (value: string) => {
        setFormData((prev) => ({ ...prev, taxId: formatCpfCnpj(value) }))
    }

    const isFormValid =
        formData.name.length >= 3 &&
        formData.email.includes('@') &&
        formData.whatsapp.length >= 14 &&
        formData.taxId.length >= 14 &&
        acceptedTerms

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError('')

        const result = leadSchema.safeParse({ ...formData, acceptedTerms })
        if (!result.success) {
            const fieldErrors: typeof errors = {}
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof LeadFormData
                fieldErrors[key] = issue.message
            })
            setErrors(fieldErrors)
            return
        }

        setErrors({})
        setLoading(true)

        try {
            const newLeadId = crypto.randomUUID()

            // 1. Save lead to Supabase
            const { error: insertError } = await supabase
                .from('leads')
                .insert({
                    id: newLeadId,
                    name: formData.name,
                    whatsapp: formData.whatsapp,
                    email: formData.email,
                    plan_id: planId,
                    status: 'pending_payment',
                })

            if (insertError) throw new Error(insertError.message)

            // 2. Call Edge Function to create recurring billing
            const { data: checkoutData, error: fnError } = await supabase.functions.invoke(
                'checkout',
                {
                    body: {
                        lead_id: newLeadId,
                        name: formData.name,
                        email: formData.email,
                        whatsapp: formData.whatsapp,
                        taxId: formData.taxId,
                        plan_id: planId,
                    },
                }
            )

            if (fnError) throw new Error(fnError.message)
            if (!checkoutData?.init_point) throw new Error('URL de pagamento não recebida.')

            // 3. Save checkout data for return flow, then redirect to Asaas checkout
            sessionStorage.setItem('checkout_init_point', checkoutData.init_point)
            sessionStorage.setItem('checkout_lead_id', newLeadId)
            sessionStorage.setItem('checkout_complete', 'true')
            window.location.href = checkoutData.init_point

        } catch (err) {
            if (mountedRef.current) {
                setSubmitError(
                    err instanceof Error
                        ? err.message
                        : 'Erro inesperado. Tente novamente ou fale com nosso suporte.'
                )
                setLoading(false)
            }
        }
    }

    return (
        <>
            <div className="lead-overlay" onClick={onClose}>
                <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="lead-modal-header">
                        <button className="lead-close-btn" onClick={onClose} aria-label="Fechar">
                            ×
                        </button>
                        <span className="plan-badge">{plan.name}</span>
                        <h2>Preencha seus dados</h2>
                        <p className="plan-price">
                            <strong>R$ {plan.price.toFixed(2).replace('.', ',')}</strong>/mês
                        </p>
                    </div>

                    <div className="lead-modal-body">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="lead-form-group">
                                <label htmlFor="lead-name">Nome Completo</label>
                                <input
                                    id="lead-name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    className={errors.name ? 'input-error' : ''}
                                />
                                {errors.name && <p className="field-error">{errors.name}</p>}
                            </div>

                            <div className="lead-form-group">
                                <label htmlFor="lead-whatsapp">WhatsApp</label>
                                <input
                                    id="lead-whatsapp"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formData.whatsapp}
                                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                                    className={errors.whatsapp ? 'input-error' : ''}
                                />
                                {errors.whatsapp && <p className="field-error">{errors.whatsapp}</p>}
                            </div>

                            <div className="lead-form-group">
                                <label htmlFor="lead-email">E-mail</label>
                                <input
                                    id="lead-email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    className={errors.email ? 'input-error' : ''}
                                />
                                <p className="field-hint">📧 Use o mesmo e-mail que será usado para criar sua conta no sistema.</p>
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            <div className="lead-form-group">
                                <label htmlFor="lead-taxId">CPF ou CNPJ</label>
                                <input
                                    id="lead-taxId"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="000.000.000-00 ou CNPJ"
                                    value={formData.taxId}
                                    onChange={(e) => handleTaxIdChange(e.target.value)}
                                    className={errors.taxId ? 'input-error' : ''}
                                />
                                <p className="field-hint">🔒 Necessário para emissão de nota fiscal e processamento seguro do pagamento via Asaas.</p>
                                {errors.taxId && <p className="field-error">{errors.taxId}</p>}
                            </div>

                            <div className="lead-terms-group">
                                <input
                                    id="lead-terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="lead-terms">
                                    Li e concordo com os{' '}
                                    <button
                                        type="button"
                                        className="terms-link"
                                        onClick={() => setShowTerms(true)}
                                    >
                                        Termos de Uso e Políticas de Privacidade
                                    </button>
                                    .
                                </label>
                            </div>

                            {submitError && (
                                <p className="field-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                                    {submitError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={`lead-submit-btn ${loading ? 'loading' : ''}`}
                                disabled={!isFormValid || loading}
                            >
                                {loading ? 'Aguarde...' : 'Ir para o Pagamento'}
                            </button>

                            <p className="lead-secure-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Checkout seguro via Asaas — PIX, Boleto ou Cartão
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </>
    )
}
