import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/storefront/product-grid'
import { SortSelect } from '@/components/storefront/sort-select'
import type { Metadata } from 'next'
import type { SortOption } from '@/types'

export const metadata: Metadata = {
  title: "New Arrivals — Fali's",
  description: 'The latest additions to our collection — perfumes, clothing, and bags.',
}

async function getNewArrivals(params: Record<string, string | string[] | undefined>) {
  const supabase = await createClient()
  const sort = (params['sort'] as SortOption) ?? 'newest'

  let query = supabase
    .from('products')
    .select('*, product_media(*), categories(*), product_variants(*)')
    .eq('is_published', true)

  switch (sort) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('base_price', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(48)
  return data ?? []
}

async function NewArrivalsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const products = await getNewArrivals(params)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        <SortSelect current={(params['sort'] as SortOption) ?? 'newest'} />
      </div>
      <ProductGrid products={products as Parameters<typeof ProductGrid>[0]['products']} />
    </div>
  )
}

export default function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <div className="pt-16">
      <div className="border-b border-[var(--border)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
            Just In
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light tracking-tight sm:text-5xl">
            New Arrivals
          </h1>
          <p className="mt-3 text-[var(--muted-foreground)]">
            The latest additions across perfume, clothing, and bags.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="min-h-dvh" />}>
        <NewArrivalsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
