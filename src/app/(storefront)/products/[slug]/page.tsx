import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductGallery } from '@/components/storefront/product-gallery'
import { ProductInfo } from '@/components/storefront/product-info'
import { RelatedProducts } from '@/components/storefront/related-products'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, product_media(*), categories(*), product_variants(*), product_attributes(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .order('sort_order', { referencedTable: 'product_media', ascending: true })
    .single()

  return data
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return { title: 'Product Not Found' }

  const image = product.product_media?.[0]?.url

  return {
    title: product.name,
    description: product.description ?? `${product.name} by ${product.brand}`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: image ? [{ url: image }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    image: product.product_media.map((m) => m.url),
    offers: product.product_variants.map((v) => ({
      '@type': 'Offer',
      price: v.price_override ?? product.base_price,
      priceCurrency: product.currency,
      availability:
        v.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      sku: v.sku,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-16">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            <ProductGallery media={product.product_media} productName={product.name} />
            <ProductInfo product={product as Parameters<typeof ProductInfo>[0]['product']} />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4]" />
                ))}
              </div>
            </div>
          }
        >
          <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
        </Suspense>
      </div>
    </>
  )
}
