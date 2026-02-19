import { z } from 'zod'

// CPF/CNPJ raw digit validation
function isValidCpf(digits: string): boolean {
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
    let r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    if (r !== parseInt(digits[9])) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
    r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    return r === parseInt(digits[10])
}

function isValidCnpj(digits: string): boolean {
    if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false
    const calc = (d: string, weights: number[]) =>
        weights.reduce((acc, w, i) => acc + parseInt(d[i]) * w, 0)
    const mod = (n: number) => { const r = n % 11; return r < 2 ? 0 : 11 - r }
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    return (
        mod(calc(digits, w1)) === parseInt(digits[12]) &&
        mod(calc(digits, w2)) === parseInt(digits[13])
    )
}

export const leadSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome muito longo'),
    whatsapp: z
        .string()
        .regex(
            /^\(\d{2}\)\s?\d{4,5}-\d{4}$/,
            'WhatsApp inválido. Use o formato (XX) XXXXX-XXXX'
        ),
    email: z.string().email('E-mail inválido'),
    taxId: z.string().refine((val) => {
        const digits = val.replace(/\D/g, '')
        return isValidCpf(digits) || isValidCnpj(digits)
    }, 'CPF ou CNPJ inválido'),
    acceptedTerms: z.literal(true, {
        message: 'Você deve aceitar os termos',
    }),
})

export type LeadFormData = z.infer<typeof leadSchema>

export function formatWhatsApp(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    if (digits.length <= 2) return digits.length ? `(${digits}` : ''
    if (digits.length <= 7)
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function formatCpfCnpj(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14)
    if (digits.length <= 11) {
        // CPF: 000.000.000-00
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
    }
    // CNPJ: 00.000.000/0000-00
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}
