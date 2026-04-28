'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/lib/actions/checkout'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const lineItems = items.map((item) => ({
        variant_id: item.variant_id,
        product_id: item.products.id,
        quantity: item.quantity,
      }))
      const result = await createCheckoutSession(lineItems)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // on success, createCheckoutSession calls redirect() internally
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag className="h-12 w-12 text-[var(--muted-foreground)]" />
        <h1 className="font-serif text-2xl font-light">Your cart is empty</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Add some items before checking out.
        </p>
        <Button asChild className="mt-2">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Continue shopping
        </Link>

        <h1 className="font-serif text-3xl font-light tracking-tight">Review your order</h1>

        <div className="mt-8 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {items.map((item) => {
            const price = item.product_variants.price_override ?? item.products.base_price
            const image = item.products.product_media?.[0]?.url
            return (
              <div key={item.id} className="flex gap-4 p-4 sm:p-6">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.products.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-medium">{item.products.name}</p>
                    <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                      {[item.product_variants.size, item.product_variants.color]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(price * item.quantity).toFixed(2)}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-[var(--border)] p-6">
          <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
            <span>Subtotal</span>
            <span>${total().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-3 font-medium">
            <span>Total</span>
            <span>${total().toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <Button size="lg" className="mt-6 w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to payment…
            </>
          ) : (
            `Pay $${total().toFixed(2)}`
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
          Secured by Stripe. Your payment information is never stored on our servers.
        </p>
      </div>
    </div>
  )
}
