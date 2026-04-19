'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { SortOption } from '@/types'

const options: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Selling', value: 'best_selling' },
]

export function SortSelect({ current }: { current: SortOption }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value as SortOption)}
      className="rounded border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
      aria-label="Sort products"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
