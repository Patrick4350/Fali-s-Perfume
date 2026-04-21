'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { upsertVariant, deleteVariant } from '@/lib/actions/products'
import { Trash2 } from 'lucide-react'

interface Variant {
  id: string
  sku: string
  size: string | null
  color: string | null
  price_override: number | null
  stock_quantity: number
  is_active: boolean
}

interface VariantsManagerProps {
  productId: string
  variants: Variant[]
}

type ActionState = { error?: string; success?: boolean } | null

function VariantRow({ variant, productId }: { variant: Variant; productId: string }) {
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_auto] items-center gap-2 border-b border-[var(--border)] py-2 text-sm last:border-0">
      <span className="font-mono text-xs">{variant.sku}</span>
      <span>{variant.size ?? '—'}</span>
      <span>{variant.color ?? '—'}</span>
      <span>{variant.price_override != null ? `$${variant.price_override}` : 'Base'}</span>
      <span
        className={
          variant.stock_quantity === 0
            ? 'text-red-500'
            : variant.stock_quantity < 5
              ? 'text-amber-500'
              : ''
        }
      >
        {variant.stock_quantity}
      </span>
      <button
        onClick={async () => {
          setDeleting(true)
          await deleteVariant(variant.id, productId)
        }}
        disabled={deleting}
        className="text-[var(--muted-foreground)] transition-colors hover:text-red-500 disabled:opacity-40"
        aria-label="Delete variant"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function VariantsManager({ productId, variants }: VariantsManagerProps) {
  const [adding, setAdding] = useState(false)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(upsertVariant, null)

  return (
    <div className="max-w-2xl space-y-4">
      {variants.length > 0 && (
        <div>
          <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_auto] gap-2 pb-2 text-xs font-medium tracking-widest text-[var(--muted-foreground)] uppercase">
            <span>SKU</span>
            <span>Size</span>
            <span>Color</span>
            <span>Price</span>
            <span>Stock</span>
            <span />
          </div>
          {variants.map((v) => (
            <VariantRow key={v.id} variant={v} productId={productId} />
          ))}
        </div>
      )}

      {!adding ? (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          Add variant
        </Button>
      ) : (
        <form
          action={formAction}
          className="space-y-4 rounded-lg border border-[var(--border)] p-4"
        >
          <input type="hidden" name="product_id" value={productId} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                required
                defaultValue={`SKU-${Date.now().toString(36).toUpperCase()}`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                name="size"
                placeholder="e.g. 50ml, S, One Size"
                defaultValue="One Size"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                placeholder="e.g. Black, Beige"
                defaultValue="Default"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price_override">Price override</Label>
              <Input
                id="price_override"
                name="price_override"
                type="number"
                step="0.01"
                min="0"
                placeholder="Leave blank for base price"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock_quantity">Stock *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                defaultValue="0"
                required
              />
            </div>
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : 'Add'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
