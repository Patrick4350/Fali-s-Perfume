import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/storefront/product-card'
import { HorizontalScroll } from '@/components/storefront/horizontal-scroll'
import { createClient } from '@/lib/supabase/server'

async function getNewArrivals() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, product_media(*), categories(*), product_variants(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return data ?? []
}

export async function NewArrivalsSection() {
  const products = await getNewArrivals()

  return (
    <section className="overflow-hidden py-20" aria-labelledby="new-arrivals-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
              Just In
            </p>
            <h2
              id="new-arrivals-heading"
              className="mt-2 font-serif text-3xl font-light tracking-tight sm:text-4xl"
            >
              New Arrivals
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="hidden items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] sm:flex"
            aria-label="View all new arrivals"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {products.length > 0 ? (
        <HorizontalScroll>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product as Parameters<typeof ProductCard>[0]['product']}
              index={index}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[var(--muted-foreground)]">No new arrivals yet.</p>
        </div>
      )}
    </section>
  )
}
