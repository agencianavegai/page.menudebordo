import { z } from 'zod'

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
