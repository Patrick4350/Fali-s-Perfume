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
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

type ActionState = { error?: string; success?: boolean } | null

export function ProductForm({ product, categories }: ProductFormProps) {
  const action = product ? updateProduct : createProduct
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null)

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      {product && <input type="hidden" name="slug" value={product.slug} />}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" name="brand" defaultValue={product?.brand ?? ''} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="base_price">Base price (USD)</Label>
        <Input
          id="base_price"
          name="base_price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={product?.base_price}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={product?.category_id}
          className="flex h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="">Select category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (HTML)</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={product?.description ?? ''}
          className="flex w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          value="true"
          defaultChecked={product?.is_published}
          className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
        />
        <Label htmlFor="is_published">Published</Label>
        <input type="hidden" name="is_published" value="false" />
      </div>

      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : product ? 'Save changes' : 'Create product'}
      </Button>
    </form>
  )
}
