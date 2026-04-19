'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  options: { brands: string[]; sizes: string[]; colors: string[] }
}

export function FilterPanel({ options }: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string, toggle = true) => {
      const params = new URLSearchParams(searchParams.toString())
      if (toggle && params.get(key) === value) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const current = params.getAll(key)
      if (current.includes(value)) {
        params.delete(key)
        current.filter((v) => v !== value).forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    router.push(pathname, { scroll: false })
  }

  const hasFilters = searchParams.toString().length > 0

  const activeBrands = searchParams.getAll('brands')
  const activeSizes = searchParams.getAll('sizes')
  const activeColors = searchParams.getAll('colors')
  const inStock = searchParams.get('in_stock') === 'true'

  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-widest uppercase">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-[var(--muted-foreground)]"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* In Stock */}
      <div>
        <button
          onClick={() => setParam('in_stock', inStock ? 'false' : 'true', false)}
          className="flex w-full items-center justify-between text-sm"
          aria-pressed={inStock}
        >
          <span>In Stock Only</span>
          <div
            className={cn(
              'h-4 w-8 rounded-full transition-colors',
              inStock ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
            )}
          >
            <div
              className={cn(
                'mt-0.5 ml-0.5 h-3 w-3 rounded-full bg-white transition-transform',
                inStock ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
        </button>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase">Price</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get('min_price') ?? ''}
            onBlur={(e) => setParam('min_price', e.target.value, false)}
            className="w-full rounded border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm"
            aria-label="Minimum price"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get('max_price') ?? ''}
            onBlur={(e) => setParam('max_price', e.target.value, false)}
            className="w-full rounded border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {options.brands.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase">Brand</h3>
            <div className="space-y-2">
              {options.brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleArrayParam('brands', brand)}
                  className={cn(
                    'flex w-full items-center gap-2 text-sm transition-colors',
                    activeBrands.includes(brand)
                      ? 'font-medium text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                  aria-pressed={activeBrands.includes(brand)}
                >
                  <div
                    className={cn(
                      'h-3.5 w-3.5 rounded-sm border transition-colors',
                      activeBrands.includes(brand)
                        ? 'border-[var(--accent)] bg-[var(--accent)]'
                        : 'border-[var(--border)]'
                    )}
                  />
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {options.sizes.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase">Size</h3>
            <div className="flex flex-wrap gap-2">
              {options.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleArrayParam('sizes', size)}
                  className={cn(
                    'rounded border px-2.5 py-1 text-xs transition-all',
                    activeSizes.includes(size)
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                  )}
                  aria-pressed={activeSizes.includes(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {options.colors.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase">Color</h3>
            <div className="flex flex-wrap gap-2">
              {options.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleArrayParam('colors', color)}
                  className={cn(
                    'rounded border px-2.5 py-1 text-xs transition-all',
                    activeColors.includes(color)
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                  )}
                  aria-pressed={activeColors.includes(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
