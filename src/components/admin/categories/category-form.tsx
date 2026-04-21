'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategory } from '@/lib/actions/categories'

interface Category {
  id: string
  name: string
}

type ActionState = { error?: string; success?: boolean } | null

export function CategoryForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createCategory, null)

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Name *</Label>
          <Input id="cat-name" name="name" required placeholder="e.g. Shoulder Bags" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-type">Type *</Label>
          <select
            id="cat-type"
            name="type"
            required
            className="flex h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="">Select type…</option>
            <option value="perfume">Perfume</option>
            <option value="clothing">Clothing</option>
            <option value="bags">Bags</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-description">Description</Label>
        <Input id="cat-description" name="description" placeholder="Optional description" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-parent">Parent category (optional)</Label>
        <select
          id="cat-parent"
          name="parent_id"
          className="flex h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="">None (top-level)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">Category created.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating…' : 'Create category'}
      </Button>
    </form>
  )
}
