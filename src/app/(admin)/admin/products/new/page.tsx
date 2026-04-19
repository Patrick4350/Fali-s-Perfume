import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/products/product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, type')
    .order('name')

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">New product</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
