import { createClient } from '@/lib/supabase/server'
import { SearchResults } from '@/components/storefront/search-results'
import { SearchInput } from '@/components/storefront/search-input'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Search — Fali's" }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = '', page = '1' } = await searchParams
  const perPage = 24
  const pageNum = Math.max(1, Number(page))

  let results: Awaited<ReturnType<typeof fetchResults>> = []

  if (q.trim().length > 0) {
    results = await fetchResults(q.trim(), pageNum, perPage)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-serif text-3xl font-light">Search</h1>
      <SearchInput defaultValue={q} />

      {q.trim() ? (
        <div className="mt-8">
          <p className="mb-6 text-sm text-[var(--muted-foreground)]">
            {results.length === 0
              ? `No results for "${q}"`
              : `${results.length} result${results.length === 1 ? '' : 's'} for "${q}"`}
          </p>
          <SearchResults results={results} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-[var(--muted-foreground)]">
          Start typing to search perfumes and clothing.
        </p>
      )}
    </div>
  )
}

async function fetchResults(query: string, page: number, perPage: number) {
  const supabase = await createClient()
  const { data } = await supabase.rpc('search_products', {
    query,
    category_filter: null,
    min_price: null,
    max_price: null,
  })

  return (data ?? []).slice((page - 1) * perPage, page * perPage)
}
