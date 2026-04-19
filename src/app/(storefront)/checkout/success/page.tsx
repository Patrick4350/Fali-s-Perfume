import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { ClearCartOnSuccess } from '@/components/storefront/clear-cart-on-success'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Order Confirmed — Fali's" }

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  let email: string | null = null
  let orderTotal: number | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      email = session.customer_details?.email ?? null
      orderTotal = session.amount_total ? session.amount_total / 100 : null
    } catch {
      // session not found — still show success
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <ClearCartOnSuccess />

      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <svg
          className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl font-light">Order confirmed</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
        Thank you for your order
        {email ? (
          <>
            . A confirmation has been sent to{' '}
            <strong className="text-[var(--foreground)]">{email}</strong>
          </>
        ) : null}
        {orderTotal !== null ? `. Total charged: $${orderTotal.toFixed(2)}` : ''}.
      </p>

      <div className="mt-10 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/account/orders">View orders</Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
