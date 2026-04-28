'use server'

import { cookies } from 'next/headers'

export type Currency = 'USD' | 'GHS'

const COOKIE = 'store_currency'

export async function getStoreCurrency(): Promise<Currency> {
  const jar = await cookies()
  const val = jar.get(COOKIE)?.value
  return val === 'GHS' ? 'GHS' : 'USD'
}

export async function setStoreCurrency(currency: Currency): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE, currency, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
