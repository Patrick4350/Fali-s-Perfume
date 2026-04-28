'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, Check } from 'lucide-react'
import { setStoreCurrency } from '@/lib/currency'
import { useCurrencyStore } from '@/stores/currency'
import type { Currency } from '@/lib/currency'

const options: { value: Currency; label: string; symbol: string; description: string }[] = [
  {
    value: 'USD',
    label: 'US Dollar',
    symbol: '$',
    description: 'Prices displayed in United States dollars',
  },
  {
    value: 'GHS',
    label: 'Ghana Cedi',
    symbol: 'GH₵',
    description: 'Prices displayed in Ghanaian cedis',
  },
]

export default function SettingsPage() {
  const currency = useCurrencyStore((s) => s.currency)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSelect = (value: Currency) => {
    startTransition(async () => {
      await setStoreCurrency(value)
      setCurrency(value)
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Manage your store preferences</p>
      </div>

      <div className="max-w-xl rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2 className="text-sm font-semibold">Display Currency</h2>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Choose the currency used across your store for all price displays
          </p>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {options.map((option) => {
            const isSelected = currency === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={isPending || isSelected}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--muted)] disabled:cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-sm font-semibold">
                    {option.symbol}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{option.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground)]">
                    <Check className="h-3 w-3 text-[var(--background)]" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
