import { Suspense } from 'react'
import { CategoryPage } from '@/components/storefront/category-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clothing',
  description: 'Refined garments in natural fabrics — designed to last, worn with ease.',
}

export default function ClothingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <CategoryPage type="clothing" searchParams={searchParams} />
    </Suspense>
  )
}
