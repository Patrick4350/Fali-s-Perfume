import { create } from 'zustand'
import type { Currency } from '@/lib/currency'

interface CurrencyStore {
  currency: Currency
  setCurrency: (c: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: 'USD',
  setCurrency: (currency) => set({ currency }),
}))
