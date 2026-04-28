import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

type SearchResult = {
  id: string
  name: string
  slug: string
  brand: string
  base_price: number
  category_id: string
  image_url?: string | null
  rank: number
}

export function SearchResults({ results }: { results: SearchResult[] }) {
  if (!results.length) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {results.map((result) => (
        <Link key={result.id} href={`/products/${result.slug}`} className="group block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[var(--muted)]">
            {result.image_url && (
              <Image
                src={result.image_url}
                alt={result.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </div>
          <div className="mt-2">
            <p className="text-xs text-[var(--muted-foreground)]">{result.brand}</p>
            <p className="mt-0.5 text-sm leading-snug font-medium">{result.name}</p>
            <p className="mt-1 text-sm">{formatCurrency(result.base_price)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
