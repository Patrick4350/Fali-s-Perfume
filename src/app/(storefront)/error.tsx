'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 className="font-serif text-2xl font-light">Something went wrong</h2>
      <p className="text-sm text-[var(--muted-foreground)]">
        We encountered an unexpected error. Please try again.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="font-mono text-xs text-[var(--muted-foreground)]">Error ID: {error.digest}</p>
      )}
    </div>
  )
}
