import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/product-card'
import type { ProductWithMedia } from '@/types'

export async function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: string
  currentProductId: string
}) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, product_media(*), categories(*), product_variants(*), product_attributes(*)')
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('id', currentProductId)
    .limit(4)

  if (!data?.length) return null

  return (
    <section className="border-t border-[var(--border)] py-16" aria-labelledby="related-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="related-heading" className="mb-8 font-serif text-2xl font-light tracking-tight">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {data.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product as ProductWithMedia}
              index={i}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
