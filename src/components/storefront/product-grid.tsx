'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/storefront/product-card'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { ProductWithMedia } from '@/types'

export function ProductGrid({ products }: { products: ProductWithMedia[] }) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <ShoppingBag className="h-12 w-12 text-[var(--muted-foreground)]" strokeWidth={1} />
        <h3 className="mt-4 text-lg font-medium">No products found</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Try adjusting your filters or browse all products.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} className="w-full" />
      ))}
    </div>
  )
}
