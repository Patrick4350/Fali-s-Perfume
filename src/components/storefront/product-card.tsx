'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useCurrencyStore } from '@/stores/currency'
import type { ProductWithMedia } from '@/types'

interface ProductCardProps {
  product: ProductWithMedia
  index?: number
  className?: string
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const currency = useCurrencyStore((s) => s.currency)
  const primaryImage = product.product_media?.[0]
  const hoverImage = product.product_media?.[1]
  const lowestPrice = Math.min(
    product.base_price,
    ...product.product_variants
      .filter((v) => v.price_override !== null)
      .map((v) => v.price_override!)
  )
  const isOutOfStock = product.product_variants.every((v) => v.stock_quantity === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block w-64 flex-shrink-0"
        aria-label={`View ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text ?? product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 80vw, 256px"
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.alt_text ?? product.name}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 768px) 80vw, 256px"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-[var(--muted-foreground)]">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <Badge variant="accent" className="text-[10px]">
                Featured
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-[10px]">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 bg-[var(--background)]/80 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(e) => {
              e.preventDefault()
              // TODO: wishlist action
            }}
          >
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-0.5">
          <p className="text-xs text-[var(--muted-foreground)]">{product.brand}</p>
          <p className="text-sm leading-snug font-medium">{product.name}</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatCurrency(lowestPrice, currency)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
