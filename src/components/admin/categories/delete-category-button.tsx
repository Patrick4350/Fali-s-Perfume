'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/categories'

export function DeleteCategoryButton({ id, productCount }: { id: string; productCount: number }) {
  const [deleting, setDeleting] = useState(false)

  if (productCount > 0) {
    return (
      <span className="text-xs text-[var(--muted-foreground)]">
        {productCount} product{productCount !== 1 ? 's' : ''}
      </span>
    )
  }

  return (
    <button
      onClick={async () => {
        if (!confirm('Delete this category?')) return
        setDeleting(true)
        await deleteCategory(id)
      }}
      disabled={deleting}
      className="text-[var(--muted-foreground)] transition-colors hover:text-red-500 disabled:opacity-40"
      aria-label="Delete category"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  )
}
