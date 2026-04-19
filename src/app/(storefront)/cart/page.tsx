import type { Metadata } from 'next'
import { CartPageClient } from '@/components/storefront/cart-page-client'

export const metadata: Metadata = { title: "Cart — Fali's" }

export default function CartPage() {
  return <CartPageClient />
}
