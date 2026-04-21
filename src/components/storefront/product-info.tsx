'use client'

import { useState, useEffect } from 'react'
import { Heart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ProductWithMedia } from '@/types'
import { generateId } from '@/lib/utils'
import { usePostHog } from 'posthog-js/react'
import { Events } from '@/lib/analytics-events'

interface ProductInfoProps {
  product: ProductWithMedia
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.product_variants[0]?.id ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const ph = usePostHog()

  useEffect(() => {
    ph.capture(Events.PRODUCT_VIEWED, {
      product_id: product.id,
      product_name: product.name,
      product_brand: product.brand,
      product_price: product.base_price,
      category_id: product.category_id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  const selectedVariant = product.product_variants.find((v) => v.id === selectedVariantId)
  const price = selectedVariant?.price_override ?? product.base_price
  const isOutOfStock = !selectedVariant || selectedVariant.stock_quantity === 0
  const maxQuantity = selectedVariant?.stock_quantity ?? 0

  const sizes = [
    ...new Set(product.product_variants.filter((v) => v.is_active).map((v) => v.size)),
  ].filter(Boolean) as string[]

  const colors = [
    ...new Set(product.product_variants.filter((v) => v.is_active).map((v) => v.color)),
  ].filter(Boolean) as string[]

  const attributes = product.product_attributes ?? []

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return

    ph.capture(Events.ADD_TO_CART, {
      product_id: product.id,
      product_name: product.name,
      product_brand: product.brand,
      variant_id: selectedVariant.id,
      variant_sku: selectedVariant.sku,
      variant_size: selectedVariant.size,
      variant_color: selectedVariant.color,
      price: selectedVariant.price_override ?? product.base_price,
      quantity,
    })

    setIsAdding(true)
    addItem({
      id: generateId(),
      cart_id: '',
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      products: {
        ...product,
        product_media: product.product_media,
      },
      product_variants: selectedVariant,
    })

    setTimeout(() => {
      setIsAdding(false)
      openCart()
    }, 300)
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <div>
        <p className="text-sm text-[var(--muted-foreground)]">{product.brand}</p>
        <h1 className="mt-1 font-serif text-3xl font-light tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-2xl font-light">{formatCurrency(price)}</p>
      </div>

      <Separator />

      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.product_variants
              .filter((v) => v.is_active)
              .map((variant) => {
                const isSelected = variant.id === selectedVariantId
                const outOfStock = variant.stock_quantity === 0

                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={outOfStock}
                    className={cn(
                      'rounded border px-4 py-2 text-sm transition-all',
                      isSelected
                        ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                        : 'border-[var(--border)] hover:border-[var(--foreground)]',
                      outOfStock && 'cursor-not-allowed line-through opacity-40'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`Size ${variant.size ?? variant.sku}${outOfStock ? ' — out of stock' : ''}`}
                  >
                    {variant.size ?? variant.sku}
                  </button>
                )
              })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase">
            Color{selectedVariant?.color ? ` — ${selectedVariant.color}` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              ...new Set(
                product.product_variants.filter((v) => v.is_active && v.color).map((v) => v.color)
              ),
            ].map((color) => {
              const variantsWithColor = product.product_variants.filter((v) => v.color === color)
              const isSelected = variantsWithColor.some((v) => v.id === selectedVariantId)
              return (
                <button
                  key={color}
                  onClick={() => {
                    const firstWithColor = variantsWithColor[0]
                    if (firstWithColor) setSelectedVariantId(firstWithColor.id)
                  }}
                  className={cn(
                    'rounded border px-3 py-1.5 text-xs transition-all',
                    isSelected
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] hover:border-[var(--foreground)]'
                  )}
                  aria-pressed={isSelected}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      {isOutOfStock && (
        <Badge variant="secondary" className="w-fit">
          Out of Stock
        </Badge>
      )}

      {/* Quantity + Add to cart */}
      <div className="flex gap-3">
        <div className="flex items-center rounded border border-[var(--border)]">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          size="lg"
          className="flex-1"
        >
          {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding…' : 'Add to Cart'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          aria-label="Add to wishlist"
          onClick={() => {
            ph.capture(Events.ADD_TO_WISHLIST, {
              product_id: product.id,
              product_name: product.name,
              variant_id: selectedVariantId,
            })
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="pt-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {attributes.some((a) =>
            ['notes', 'ingredients', 'fabric'].includes(a.key.toLowerCase())
          ) && (
            <TabsTrigger value="composition">
              {product.categories.type === 'perfume' ? 'Notes' : 'Fabric'}
            </TabsTrigger>
          )}
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {product.description ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-[var(--muted-foreground)]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              No additional details available.
            </p>
          )}
        </TabsContent>

        <TabsContent value="composition">
          <dl className="space-y-2">
            {attributes
              .filter((a) =>
                ['notes', 'ingredients', 'fabric', 'material'].includes(a.key.toLowerCase())
              )
              .map((attr) => (
                <div key={attr.id} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                  <dt className="font-medium text-[var(--muted-foreground)] capitalize">
                    {attr.key}
                  </dt>
                  <dd>{attr.value}</dd>
                </div>
              ))}
          </dl>
        </TabsContent>

        <TabsContent value="shipping">
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>Free standard shipping on orders over $100.</p>
            <p>Express delivery available at checkout.</p>
            <p>
              Returns accepted within 30 days of delivery for unused items in original packaging.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
