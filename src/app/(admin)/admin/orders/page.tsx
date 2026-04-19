import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders — Admin' }

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
  paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  fulfilled: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
  shipped: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200',
}

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

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
                <tr key={order.id} className="transition-colors hover:bg-[var(--muted)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                        statusColors[order.status] ?? ''
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(order.total)}
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
