export interface Plan {
    id: string
    name: string
    price: number
    description: string
}

export const PLANS: Record<string, Plan> = {
    basic: {
        id: 'basic',
        name: 'Cardápio Digital',
        price: 49.9,
        description: 'Assinatura Mensal — Cardápio Digital',
    },
    pro: {
        id: 'pro',
        name: 'Gestão PRO',
        price: 100.0,
        description: 'Assinatura Mensal — Gestão PRO',
    },
}
