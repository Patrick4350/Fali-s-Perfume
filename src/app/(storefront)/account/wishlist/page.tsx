import Link from 'next/link'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { WishlistItem } from '@/components/account/wishlist-item'
import type { Metadata } from 'next'
import type { ProductWithMedia } from '@/types'

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

  const products = (items ?? [])
    .map((i) => i.products)
    .filter(Boolean) as unknown as ProductWithMedia[]

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="mb-4 h-10 w-10 text-[var(--muted-foreground)]" strokeWidth={1.5} />
        <p className="font-medium">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Save items you love by tapping the heart on any product.
        </p>
        <Link
          href="/perfume"
          className="mt-6 text-sm underline underline-offset-4 hover:opacity-70"
        >
          Start exploring
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        {products.length} {products.length === 1 ? 'item' : 'items'}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <WishlistItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
