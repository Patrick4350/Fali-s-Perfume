import { createClient } from '@/lib/supabase/server'
import { getStoreCurrency } from '@/lib/currency'
import { formatCurrency } from '@/lib/utils'
import { RevenueChart } from '@/components/admin/analytics/revenue-chart'
import { TopProductsChart } from '@/components/admin/analytics/top-products-chart'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics — Admin' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const currency = await getStoreCurrency()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: orders }, { data: orderItems }, { data: products }] = await Promise.all([
    supabase
      .from('orders')
      .select('total, status, created_at')
      .eq('status', 'paid')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true }),
    supabase
      .from('order_items')
      .select('quantity, total_price, products(name)')
      .gte('created_at', thirtyDaysAgo),
    supabase.from('products').select('id').eq('is_published', true),
  ])

  // Build daily revenue for last 30 days
  const revenueByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    revenueByDay[key] = 0
  }
  for (const order of orders ?? []) {
    const key = order.created_at.slice(0, 10)
    if (key in revenueByDay) revenueByDay[key] += order.total
  }
  const revenueData = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue * 100) / 100,
  }))

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; units: number }> = {}
  for (const item of orderItems ?? []) {
    const name = (item.products as { name: string } | null)?.name ?? 'Unknown'
    if (!productRevenue[name]) productRevenue[name] = { name, revenue: 0, units: 0 }
    productRevenue[name].revenue += item.total_price
    productRevenue[name].units += item.quantity
  }
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((p) => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }))

  const totalRevenue = (orders ?? []).reduce((sum, o) => sum + o.total, 0)
  const totalOrders = (orders ?? []).length
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const stats = [
    { label: 'Revenue (30d)', value: formatCurrency(totalRevenue, currency) },
    { label: 'Orders (30d)', value: totalOrders.toString() },
    { label: 'Avg Order Value', value: formatCurrency(avgOrder, currency) },
    { label: 'Published Products', value: (products?.length ?? 0).toString() },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Last 30 days</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <p className="text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-sm font-semibold">Daily Revenue</h2>
        <RevenueChart data={revenueData} currency={currency} />
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="mb-4 text-sm font-semibold">Top Products by Revenue</h2>
          <TopProductsChart data={topProducts} currency={currency} />
        </div>
      )}
    </div>
  )
}
