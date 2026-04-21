import { Suspense } from 'react'
import { CategoryPage } from '@/components/storefront/category-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bags',
  description:
    'Handcrafted bags in premium leather and natural materials — shaped for quiet confidence and everyday use.',
}

export default function BagsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <CategoryPage type="bags" searchParams={searchParams} />
    </Suspense>
  )
}
