import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/storefront/product-grid'
import { FilterPanel } from '@/components/storefront/filter-panel'
import { SortSelect } from '@/components/storefront/sort-select'
import type { SortOption } from '@/types'

interface CategoryPageProps {
  type: 'perfume' | 'clothing'
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getProducts(
  type: 'perfume' | 'clothing',
  params: Record<string, string | string[] | undefined>
) {
  const supabase = await createClient()

  const sort = (params['sort'] as SortOption) ?? 'newest'
  const minPrice = params['min_price'] ? Number(params['min_price']) : undefined
  const maxPrice = params['max_price'] ? Number(params['max_price']) : undefined
  const inStock = params['in_stock'] === 'true'
  const brands = params['brands']
    ? typeof params['brands'] === 'string'
      ? [params['brands']]
      : params['brands']
    : []
  const sizes = params['sizes']
    ? typeof params['sizes'] === 'string'
      ? [params['sizes']]
      : params['sizes']
    : []
  const colors = params['colors']
    ? typeof params['colors'] === 'string'
      ? [params['colors']]
      : params['colors']
    : []

  let query = supabase
    .from('products')
    .select('*, product_media(*), categories!inner(*), product_variants(*)')
    .eq('is_published', true)
    .eq('categories.type', type)

  if (minPrice !== undefined) query = query.gte('base_price', minPrice)
  if (maxPrice !== undefined) query = query.lte('base_price', maxPrice)
  if (brands.length > 0) query = query.in('brand', brands)

  switch (sort) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('base_price', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(48)

  let products = data ?? []

  // Client-side filters that need variant data
  if (inStock) {
    products = products.filter((p) =>
      p.product_variants.some((v) => v.stock_quantity > 0 && v.is_active)
    )
  }
  if (sizes.length > 0) {
    products = products.filter((p) =>
      p.product_variants.some((v) => v.size && sizes.includes(v.size))
    )
  }
  if (colors.length > 0) {
    products = products.filter((p) =>
      p.product_variants.some((v) => v.color && colors.includes(v.color))
    )
  }

  return products
}

async function getFilterOptions(type: 'perfume' | 'clothing') {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('brand, product_variants(size, color), categories!inner(type)')
    .eq('is_published', true)
    .eq('categories.type', type)

  if (!products) return { brands: [], sizes: [], colors: [] }

  const brands = [...new Set(products.map((p) => p.brand))].sort()
  const sizes = [
    ...new Set(
      products.flatMap((p) => p.product_variants.map((v) => v.size).filter(Boolean)) as string[]
    ),
  ].sort()
  const colors = [
    ...new Set(
      products.flatMap((p) => p.product_variants.map((v) => v.color).filter(Boolean)) as string[]
    ),
  ].sort()

  return { brands, sizes, colors }
}

const typeLabels = {
  perfume: { title: 'Perfume', description: 'Artisanal fragrances for every mood and moment.' },
  clothing: { title: 'Clothing', description: 'Refined garments in natural fabrics.' },
}

export async function CategoryPage({ type, searchParams }: CategoryPageProps) {
  const params = await searchParams
  const [products, filterOptions] = await Promise.all([
    getProducts(type, params),
    getFilterOptions(type),
  ])

  const { title, description } = typeLabels[type]

  return (
    <div className="pt-16">
      {/* Page header */}
      <div className="border-b border-[var(--border)] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">{description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Filters */}
          <aside>
            <FilterPanel options={filterOptions} />
          </aside>

          {/* Products */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <SortSelect current={(params['sort'] as SortOption) ?? 'newest'} />
            </div>

            <ProductGrid products={products as Parameters<typeof ProductGrid>[0]['products']} />
          </div>
        </div>
      </div>
    </div>
  )
}
