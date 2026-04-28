'use client'

import { useTransition } from 'react'
import { updateOrderStatus, type OrderStatus } from '@/lib/actions/orders'

const statuses: OrderStatus[] = [
  'pending',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

const statusColors: Record<OrderStatus, string> = {
  pending: 'text-yellow-700 dark:text-yellow-300',
  paid: 'text-blue-700 dark:text-blue-300',
  fulfilled: 'text-purple-700 dark:text-purple-300',
  shipped: 'text-orange-700 dark:text-orange-300',
  delivered: 'text-green-700 dark:text-green-300',
  cancelled: 'text-red-700 dark:text-red-300',
  refunded: 'text-gray-700 dark:text-gray-300',
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus
    startTransition(async () => {
      await updateOrderStatus(orderId, next)
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`cursor-pointer rounded border border-transparent bg-transparent px-2 py-0.5 text-xs font-medium capitalize transition-colors hover:border-[var(--border)] focus:outline-none disabled:opacity-50 ${statusColors[currentStatus]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="text-[var(--foreground)] capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  )
}
