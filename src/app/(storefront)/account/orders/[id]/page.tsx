import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Order — Fali's" }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!order) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest text-[var(--muted-foreground)] uppercase">Order</p>
          <p className="mt-1 font-mono text-lg">#{order.id.slice(-8).toUpperCase()}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 capitalize dark:bg-emerald-900/30 dark:text-emerald-400">
          {order.status}
        </span>
      </div>

      <div className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium">{item.product_name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {item.variant_sku}
                {item.variant_size ? ` · ${item.variant_size}` : ''}
                {item.variant_color ? ` · ${item.variant_color}` : ''}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm">{formatCurrency(item.total_price)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border)] p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Shipping</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[var(--border)] pt-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/account/orders"
        className="inline-block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← Back to orders
      </Link>
    </div>
  )
}
