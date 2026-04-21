import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/products/product-form'
import { VariantsManager } from '@/components/admin/products/variants-manager'
import { MediaManager } from '@/components/admin/products/media-manager'
import { AttributesManager } from '@/components/admin/products/attributes-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [productResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*), product_media(*), product_attributes(*), categories(type)')
      .eq('id', id)
      .single(),
    supabase.from('categories').select('id, name, type').order('name'),
  ])

  if (!productResult.data) notFound()

  const product = productResult.data
  const categories = categoriesResult.data ?? []

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Edit product</h1>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
          Details
        </h2>
        <ProductForm product={product} categories={categories} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
          Variants
        </h2>
        <VariantsManager productId={id} variants={product.product_variants} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
          Attributes
        </h2>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          Notes, materials, care instructions, dimensions — anything that describes the product.
        </p>
        <AttributesManager
          productId={id}
          attributes={product.product_attributes}
          categoryType={(product.categories as { type: string } | null)?.type}
        />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
          Media
        </h2>
        <MediaManager productId={id} media={product.product_media} />
      </section>
    </div>
  )
}
