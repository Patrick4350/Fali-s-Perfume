import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getStoreCurrency } from '@/lib/currency'
import { OrderStatusSelect } from '@/components/admin/orders/order-status-select'
import type { Metadata } from 'next'
import type { OrderStatus } from '@/lib/actions/orders'

export const metadata: Metadata = { title: 'Orders — Admin' }

export default async function OrdersPage() {
  const supabase = await createClient()

  const [{ data: orders }, currency] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
    getStoreCurrency(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{orders?.length ?? 0} total</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders?.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[var(--muted)]/40">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status as OrderStatus}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(order.total, currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
