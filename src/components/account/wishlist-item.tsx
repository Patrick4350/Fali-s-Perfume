'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleWishlist } from '@/lib/actions/wishlist'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { formatCurrency, generateId } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ProductWithMedia } from '@/types'

export function WishlistItem({ product }: { product: ProductWithMedia }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const currency = useCurrencyStore((s) => s.currency)

  const image = product.product_media?.[0]
  const firstVariant = product.product_variants?.[0]
  const price = firstVariant?.price_override ?? product.base_price
  const inStock = product.product_variants?.some((v) => v.stock_quantity > 0)

  const handleRemove = () => {
    startTransition(async () => {
      await toggleWishlist(product.id)
      router.refresh()
    })
  }

  const handleAddToCart = () => {
    if (!firstVariant || !inStock) return
    addItem({
      id: generateId(),
      cart_id: '',
      product_id: product.id,
      variant_id: firstVariant.id,
      quantity: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      products: { ...product, product_media: product.product_media },
      product_variants: firstVariant,
    })
    openCart()
  }

  return (
    <div className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="relative h-24 w-20 overflow-hidden rounded bg-[var(--muted)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text ?? product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="80px"
            />
          ) : (
            <div className="h-full w-full bg-[var(--muted)]" />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">{product.brand}</p>
          <Link
            href={`/products/${product.slug}`}
            className="mt-0.5 text-sm font-medium hover:underline"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm">{formatCurrency(price, currency)}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="gap-1.5 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Remove from wishlist"
            className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
