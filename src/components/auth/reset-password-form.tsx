'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/lib/actions/auth'

type ActionState = { error?: string; success?: boolean } | null

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(resetPassword, null)

  if (state?.success) {
    return (
      <div className="rounded-lg border border-[var(--border)] p-6 text-center">
        <p className="text-sm">Reset link sent. Check your email.</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Sending…' : 'Send reset link'}
      </Button>
      <p className="text-center text-sm text-[var(--muted-foreground)]">
        <Link href="/login" className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
