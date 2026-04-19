import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Checkout Cancelled — Fali's" }

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)]">
        <svg
          className="h-8 w-8 text-[var(--muted-foreground)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl font-light">Payment cancelled</h1>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">
        Your order was not completed. Your cart is still saved.
      </p>
      <div className="mt-10 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Continue shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/cart">Return to cart</Link>
        </Button>
      </div>
    </div>
  )
}
