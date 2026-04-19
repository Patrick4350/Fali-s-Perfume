'use client'

import { useState } from 'react'
import { deleteProduct } from '@/lib/actions/products'

export function DeleteProductButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={async () => {
            setPending(true)
            await deleteProduct(id)
          }}
          disabled={pending}
          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
        >
          {pending ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-[var(--muted-foreground)] transition-colors hover:text-red-500"
    >
      Delete
    </button>
  )
}
