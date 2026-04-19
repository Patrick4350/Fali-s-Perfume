import { Suspense } from 'react'
import { CategoryPage } from '@/components/storefront/category-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfume',
  description:
    'Discover our collection of artisanal fragrances — from fresh florals to deep woods and resins.',
}

export default function PerfumePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <CategoryPage type="perfume" searchParams={searchParams} />
    </Suspense>
  )
}
