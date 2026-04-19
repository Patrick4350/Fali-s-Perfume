import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Orders — Fali's" }

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
  refunded: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, currency, created_at, order_items(id)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (!orders?.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">No orders yet.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium hover:underline">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex items-center justify-between rounded-lg border border-[var(--border)] px-5 py-4 transition-colors hover:bg-[var(--muted)]/30"
        >
          <div>
            <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' · '}
              {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[order.status] ?? ''}`}
            >
              {order.status}
            </span>
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
