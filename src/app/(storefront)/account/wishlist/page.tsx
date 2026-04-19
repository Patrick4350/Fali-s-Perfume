import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/storefront/product-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Wishlist — Fali's" }

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: items } = await supabase
    .from('wishlists')
    .select('products(*, product_media(*), categories(*), product_variants(*))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const products = (items ?? []).map((i) => i.products).filter(Boolean) as unknown as Parameters<
    typeof ProductGrid
  >[0]['products']

  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">Your wishlist is empty.</p>
      </div>
    )
  }

  return <ProductGrid products={products} />
}
