'use client'

import { useState, useTransition } from 'react'

// Client component — calls the admin route handler instead of importing server-only code
export function AdjustStockButton({ variantId, current }: { variantId: string; current: number }) {
  const [qty, setQty] = useState(current)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(current))
  const [pending, startTransition] = useTransition()

  const save = () => {
    const newQty = Math.max(0, Number(draft))
    startTransition(async () => {
      const res = await fetch('/api/admin/adjust-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: variantId, stock_quantity: newQty }),
      })
      if (res.ok) {
        setQty(newQty)
        setEditing(false)
      }
    })
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(String(qty))
          setEditing(true)
        }}
        className="text-xs text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
      >
        Set stock
      </button>
    )
  }

  return (
    <span className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-16 rounded border border-[var(--border)] bg-transparent px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-[var(--ring)]"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
      <button
        onClick={save}
        disabled={pending}
        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
      >
        {pending ? '…' : 'Save'}
      </button>
      <button onClick={() => setEditing(false)} className="text-xs text-[var(--muted-foreground)]">
        Cancel
      </button>
    </span>
  )
}
