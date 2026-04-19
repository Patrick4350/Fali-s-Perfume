import { Suspense } from 'react'
import { HeroSection } from '@/components/storefront/hero-section'
import { NewArrivalsSection } from '@/components/storefront/new-arrivals-section'
import { CategorySplit } from '@/components/storefront/category-split'
import { JournalStrip } from '@/components/storefront/journal-strip'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Fali's — Perfume & Clothing",
  description:
    'Discover an elevated collection of artisanal perfumes and refined clothing. Curated with intention, worn with confidence.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-64 flex-shrink-0 rounded-none" />
              ))}
            </div>
          </div>
        }
      >
        <NewArrivalsSection />
      </Suspense>

      <CategorySplit />

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <JournalStrip />
      </Suspense>
    </div>
  )
}
