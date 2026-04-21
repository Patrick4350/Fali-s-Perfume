import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/categories/category-form'
import { DeleteCategoryButton } from '@/components/admin/categories/delete-category-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(id)')
    .order('type')
    .order('sort_order')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Products</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(categories ?? []).map((cat) => (
              <tr key={cat.id} className="hover:bg-[var(--muted)]/20">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)] capitalize">{cat.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                  {cat.slug}
                </td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {(cat.products as unknown[]).length}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteCategoryButton
                    id={cat.id}
                    productCount={(cat.products as unknown[]).length}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!categories?.length && (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No categories yet. Add one below.
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
          New category
        </h2>
        <CategoryForm categories={categories ?? []} />
      </div>
    </div>
  )
}
