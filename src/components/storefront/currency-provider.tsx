'use client'

import { useEffect } from 'react'
import { useCurrencyStore } from '@/stores/currency'
import type { Currency } from '@/lib/currency'

export function StorefrontCurrencyProvider({
  currency,
  children,
}: {
  currency: Currency
  children: React.ReactNode
}) {
  const setCurrency = useCurrencyStore((s) => s.setCurrency)

  useEffect(() => {
    setCurrency(currency)
  }, [currency, setCurrency])

  return <>{children}</>
}
