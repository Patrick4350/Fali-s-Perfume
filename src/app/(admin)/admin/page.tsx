import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { getStoreCurrency } from '@/lib/currency'
import { ShoppingBag, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Overview' }

async function getStats() {
  const supabase = await createClient()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [ordersToday, orders7d, orders30d, lowStock, recentOrders] = await Promise.all([
    supabase.from('orders').select('total').eq('status', 'paid').gte('created_at', today),
    supabase.from('orders').select('total').eq('status', 'paid').gte('created_at', last7),
    supabase.from('orders').select('total').eq('status', 'paid').gte('created_at', last30),
    supabase
      .from('product_variants')
      .select('id, sku, stock_quantity, products(name)')
      .lt('stock_quantity', 5)
      .eq('is_active', true)
      .limit(5),
    supabase
      .from('orders')
      .select('id, email, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const sum = (rows: { total: number }[]) => rows.reduce((acc, r) => acc + r.total, 0)

  return {
    revenueToday: sum(ordersToday.data ?? []),
    ordersToday: (ordersToday.data ?? []).length,
    revenue7d: sum(orders7d.data ?? []),
    orders7d: (orders7d.data ?? []).length,
    revenue30d: sum(orders30d.data ?? []),
    orders30d: (orders30d.data ?? []).length,
    lowStock: lowStock.data ?? [],
    recentOrders: recentOrders.data ?? [],
  }
}

export default async function AdminOverviewPage() {
  const [stats, currency] = await Promise.all([getStats(), getStoreCurrency()])

  const cards = [
    {
      label: 'Revenue Today',
      value: formatCurrency(stats.revenueToday, currency),
      sub: `${stats.ordersToday} orders`,
      icon: ShoppingBag,
    },
    {
      label: 'Revenue (7d)',
      value: formatCurrency(stats.revenue7d, currency),
      sub: `${stats.orders7d} orders`,
      icon: ShoppingBag,
    },
    {
      label: 'Revenue (30d)',
      value: formatCurrency(stats.revenue30d, currency),
      sub: `${stats.orders30d} orders`,
      icon: ShoppingBag,
    },
    {
      label: 'Low Stock Alerts',
      value: String(stats.lowStock.length),
      sub: 'variants below 5 units',
      icon: AlertTriangle,
      alert: stats.lowStock.length > 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border p-4 ${
              card.alert
                ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20'
                : 'border-[var(--border)] bg-[var(--card)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                {card.label}
              </span>
              <card.icon
                className={`h-4 w-4 ${card.alert ? 'text-amber-500' : 'text-[var(--muted-foreground)]'}`}
              />
            </div>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h2 className="text-sm font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {stats.recentOrders.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--muted-foreground)]">No orders yet.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{order.email}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(order.total, currency)}</p>
                    <span className="text-xs text-[var(--muted-foreground)] capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h2 className="text-sm font-semibold">Low Stock Alerts</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {stats.lowStock.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--muted-foreground)]">
                All variants well-stocked.
              </p>
            ) : (
              stats.lowStock.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      {(variant.products as { name: string } | null)?.name ?? '—'}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">{variant.sku}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      variant.stock_quantity === 0
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                    }`}
                  >
                    {variant.stock_quantity === 0
                      ? 'Out of stock'
                      : `${variant.stock_quantity} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
