'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/lib/actions/products'

interface Category {
  id: string
  name: string
  type: string
}
interface Product {
  id: string
  name: string
  brand: string | null
  slug: string
  description: string | null
  base_price: number
  category_id: string
  is_published: boolean
  featured: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

type ActionState = { error?: string; success?: boolean } | null

const CATEGORY_TYPE_LABELS: Record<string, string> = {
  perfume: '🧴 Perfume',
  clothing: '👕 Clothing',
  bags: '👜 Bags',
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const action = product ? updateProduct : createProduct
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null)

  const grouped = categories.reduce<Record<string, typeof categories>>((acc, cat) => {
    acc[cat.type] = [...(acc[cat.type] ?? []), cat]
    return acc
  }, {})

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {product && <input type="hidden" name="slug" value={product.slug} />}

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Product name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="e.g. Oud Noir"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            name="brand"
            required
            defaultValue={product?.brand ?? ''}
            placeholder="e.g. Fali's"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="base_price">Base price (USD) *</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.base_price}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">Category *</Label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={product?.category_id}
            className="flex h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="">Select category…</option>
            {Object.entries(grouped).map(([type, cats]) => (
              <optgroup key={type} label={CATEGORY_TYPE_LABELS[type] ?? type}>
                {cats.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product?.description ?? ''}
          placeholder="Describe the product — supports HTML"
          className="flex w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="is_published"
            value="true"
            defaultChecked={product?.is_published}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          <input type="hidden" name="is_published" value="false" />
          <span className="text-sm font-medium">Published</span>
          <span className="text-xs text-[var(--muted-foreground)]">Visible on storefront</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={product?.featured}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          <input type="hidden" name="featured" value="false" />
          <span className="text-sm font-medium">Featured</span>
          <span className="text-xs text-[var(--muted-foreground)]">Show in New Arrivals</span>
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved successfully.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : product ? 'Save changes' : 'Create product'}
      </Button>
    </form>
  )
}
