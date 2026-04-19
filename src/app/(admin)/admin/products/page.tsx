import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeleteProductButton } from '@/components/admin/products/delete-product-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, slug, brand, base_price, is_published, categories(name), product_variants(stock_quantity)'
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(products ?? []).map((product) => {
              const totalStock = (product.product_variants ?? []).reduce(
                (sum: number, v: { stock_quantity: number }) => sum + v.stock_quantity,
                0
              )
              const category = product.categories as { name: string } | null
              return (
                <tr key={product.id} className="hover:bg-[var(--muted)]/20">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{product.brand}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {category?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(product.base_price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        totalStock === 0 ? 'text-red-500' : totalStock < 10 ? 'text-amber-500' : ''
                      }
                    >
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.is_published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      {product.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!products?.length && (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No products yet.{' '}
            <Link href="/admin/products/new" className="underline">
              Add one
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
