import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Account — Fali's" }

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [ordersResult, wishlistResult] = await Promise.all([
    supabase
      .from('orders')
      .select('id, status, total, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
  ])

  const orders = ordersResult.data ?? []
  const wishlistCount = wishlistResult.count ?? 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] p-4">
          <p className="text-xs tracking-widest text-[var(--muted-foreground)] uppercase">Orders</p>
          <p className="mt-1 text-2xl font-light">
            {orders.length > 0 ? orders.length + '+' : '0'}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-4">
          <p className="text-xs tracking-widest text-[var(--muted-foreground)] uppercase">
            Wishlist
          </p>
          <p className="mt-1 text-2xl font-light">{wishlistCount}</p>
        </div>
      </div>

      {orders.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent orders</h2>
            <Link
              href="/account/orders"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--muted)]/30"
              >
                <div>
                  <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatCurrency(order.total)}</p>
                  <span className="text-xs text-[var(--muted-foreground)] capitalize">
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
