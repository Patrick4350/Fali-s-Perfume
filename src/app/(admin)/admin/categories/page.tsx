import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(id)')
    .order('type')
    .order('name')

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(categories ?? []).map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)] capitalize">{cat.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                  {cat.slug}
                </td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {(cat.products as unknown[]).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!categories?.length && (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No categories found. Run migrations and seed the database.
          </p>
        )}
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">
        Categories are managed via SQL migrations. To add or rename a category, create a new
        migration in{' '}
        <code className="rounded bg-[var(--muted)] px-1 py-0.5">supabase/migrations/</code>.
      </p>
    </div>
  )
}
