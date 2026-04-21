'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import { upsertAttribute, deleteAttribute } from '@/lib/actions/products'

interface Attribute {
  id: string
  key: string
  value: string
}

interface AttributesManagerProps {
  productId: string
  attributes: Attribute[]
  categoryType?: string
}

type ActionState = { error?: string; success?: boolean } | null

const SUGGESTED_KEYS: Record<string, string[]> = {
  perfume: [
    'Top Notes',
    'Heart Notes',
    'Base Notes',
    'Concentration',
    'Sillage',
    'Longevity',
    'Season',
    'Occasion',
    'Ingredients',
    'Country of Origin',
    'Volume',
  ],
  clothing: [
    'Material',
    'Fabric',
    'Care Instructions',
    'Fit',
    'Country of Origin',
    'Weight',
    'Lining',
    'Closure',
    'Season',
  ],
  bags: [
    'Material',
    'Dimensions',
    'Capacity',
    'Strap Drop',
    'Closure',
    'Lining',
    'Hardware',
    'Country of Origin',
    'Care Instructions',
  ],
}

function AttributeRow({ attr, productId }: { attr: Attribute; productId: string }) {
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-center gap-3 border-b border-[var(--border)] py-2 last:border-0">
      <span className="text-sm font-medium">{attr.key}</span>
      <span className="text-sm text-[var(--muted-foreground)]">{attr.value}</span>
      <button
        onClick={async () => {
          setDeleting(true)
          await deleteAttribute(attr.id, productId)
        }}
        disabled={deleting}
        className="text-[var(--muted-foreground)] transition-colors hover:text-red-500 disabled:opacity-40"
        aria-label="Delete attribute"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function AttributesManager({ productId, attributes, categoryType }: AttributesManagerProps) {
  const [adding, setAdding] = useState(false)
  const [customKey, setCustomKey] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const [state, formAction, pending] = useActionState<ActionState, FormData>(upsertAttribute, null)

  const suggestions = SUGGESTED_KEYS[categoryType ?? ''] ?? SUGGESTED_KEYS.clothing
  const displayKey = selectedKey === '__custom__' ? customKey : selectedKey

  return (
    <div className="max-w-2xl space-y-4">
      {attributes.length > 0 ? (
        <div className="rounded-lg border border-[var(--border)]">
          <div className="grid grid-cols-[1fr_2fr_auto] gap-3 border-b border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2 text-xs font-medium tracking-widest text-[var(--muted-foreground)] uppercase">
            <span>Attribute</span>
            <span>Value</span>
            <span />
          </div>
          <div className="px-3">
            {attributes.map((attr) => (
              <AttributeRow key={attr.id} attr={attr} productId={productId} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No attributes yet. Add notes, materials, care instructions, etc.
        </p>
      )}

      {!adding ? (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add attribute
        </Button>
      ) : (
        <form
          action={async (fd) => {
            if (displayKey) fd.set('key', displayKey)
            await formAction(fd)
            if (!state?.error) {
              setAdding(false)
              setSelectedKey('')
              setCustomKey('')
            }
          }}
          className="space-y-4 rounded-lg border border-[var(--border)] p-4"
        >
          <input type="hidden" name="product_id" value={productId} />

          <div className="space-y-1.5">
            <Label>Attribute name</Label>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedKey(s)}
                  className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                    selectedKey === s
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--border)] hover:border-[var(--foreground)]'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedKey('__custom__')}
                className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                  selectedKey === '__custom__'
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                    : 'border-[var(--border)] hover:border-[var(--foreground)]'
                }`}
              >
                Custom…
              </button>
            </div>
            {selectedKey === '__custom__' && (
              <Input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="e.g. Occasion"
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="attr-value">Value</Label>
            <Input
              id="attr-value"
              name="value"
              required
              placeholder={
                selectedKey === 'Top Notes'
                  ? 'e.g. Bergamot, Lemon, Pink Pepper'
                  : selectedKey === 'Material'
                    ? 'e.g. 100% Merino Wool'
                    : selectedKey === 'Care Instructions'
                      ? 'e.g. Dry clean only'
                      : selectedKey === 'Dimensions'
                        ? 'e.g. 30cm × 20cm × 12cm'
                        : 'Enter value…'
              }
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending || !displayKey}>
              {pending ? 'Saving…' : 'Add'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setSelectedKey('')
                setCustomKey('')
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
