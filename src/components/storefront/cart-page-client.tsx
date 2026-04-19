'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/lib/utils'
import { createCheckoutSession } from '@/lib/actions/checkout'

export function CartPageClient() {
  const { items, removeItem, updateQuantity, total, sessionId } = useCartStore()
  const [pending, startTransition] = useTransition()

  const subtotal = total()
  const shipping = subtotal >= 100 ? 0 : 15
  const grandTotal = subtotal + shipping

  const handleCheckout = () => {
    startTransition(async () => {
      await createCheckoutSession(
        items.map((i) => ({
          variant_id: i.variant_id,
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        sessionId
      )
    })
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="font-serif text-2xl font-light text-[var(--muted-foreground)]">
          Your cart is empty
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Browse our collections to find something you love.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/perfume">Perfume</Link>
          </Button>
          <Button asChild>
            <Link href="/clothing">Clothing</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-light">Your cart</h1>

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-12">
        {/* Items */}
        <div className="space-y-6">
          {items.map((item) => {
            const price = item.product_variants.price_override ?? item.products.base_price
            const image = item.products.product_media?.[0]?.url

            return (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
                  {image && (
                    <Image
                      src={image}
                      alt={item.products.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.products.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.products.name}
                      </Link>
                      {item.product_variants.size && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {item.product_variants.size}
                        </p>
                      )}
                      {item.product_variants.color && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {item.product_variants.color}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(price * item.quantity)}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded border border-[var(--border)]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-7 w-7 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--muted-foreground)] transition-colors hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-10 lg:mt-0">
          <div className="rounded-lg border border-[var(--border)] p-6">
            <h2 className="mb-4 text-sm font-semibold tracking-widest uppercase">Order summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[var(--muted-foreground)]">
                  Free shipping on orders over $100
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>

            <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={pending}>
              {pending ? 'Redirecting…' : 'Checkout'}
            </Button>

            <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
              Secure checkout powered by Stripe
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
