import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export function formatAmountForStripe(amount: number, currency: string): number {
  const zeroDecimalCurrencies = [
    'bif',
    'clp',
    'gnf',
    'jpy',
    'kmf',
    'mga',
    'pyg',
    'rwf',
    'ugx',
    'vnd',
    'vuv',
    'xaf',
    'xof',
  ]
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount)
  }
  return Math.round(amount * 100)
}

export function formatAmountFromStripe(amount: number, currency: string): number {
  const zeroDecimalCurrencies = [
    'bif',
    'clp',
    'gnf',
    'jpy',
    'kmf',
    'mga',
    'pyg',
    'rwf',
    'ugx',
    'vnd',
    'vuv',
    'xaf',
    'xof',
  ]
  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return amount
  }
  return amount / 100
}
