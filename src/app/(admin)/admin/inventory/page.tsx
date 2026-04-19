import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AdjustStockButton } from '@/components/admin/inventory/adjust-stock-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inventory — Admin' }

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter = 'all' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('product_variants')
    .select('id, sku, size, color, stock_quantity, is_active, products(id, name, slug)')
    .order('stock_quantity', { ascending: true })

  if (filter === 'low') query = query.lt('stock_quantity', 5).gt('stock_quantity', 0)
  if (filter === 'out') query = query.eq('stock_quantity', 0)

  const { data: variants } = await query.limit(100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <div className="flex gap-2 text-sm">
          {['all', 'low', 'out'].map((f) => (
            <Link
              key={f}
              href={`/admin/inventory?filter=${f}`}
              className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
                filter === f
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low stock' : 'Out of stock'}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Size / Color</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(variants ?? []).map((v) => {
              const product = v.products as { id: string; name: string; slug: string } | null
              return (
                <tr key={v.id} className={!v.is_active ? 'opacity-50' : ''}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product?.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {product?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {[v.size, v.color].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        v.stock_quantity === 0
                          ? 'font-medium text-red-500'
                          : v.stock_quantity < 5
                            ? 'font-medium text-amber-500'
                            : ''
                      }
                    >
                      {v.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdjustStockButton variantId={v.id} current={v.stock_quantity} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!variants?.length && (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No variants match the current filter.
          </p>
        )}
      </div>
    </div>
  )
}
