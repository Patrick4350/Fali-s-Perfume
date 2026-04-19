'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, signInWithMagicLink } from '@/lib/actions/auth'

type ActionState = { error?: string; success?: boolean } | null

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, null)
  const [magicState, magicAction, magicPending] = useActionState<ActionState, FormData>(
    signInWithMagicLink,
    null
  )
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  if (magicState?.success) {
    return (
      <div className="rounded-lg border border-[var(--border)] p-6 text-center">
        <p className="text-sm">Magic link sent! Check your email to sign in.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg border border-[var(--border)] p-1">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${mode === 'password' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode('magic')}
          className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${mode === 'magic' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
        >
          Magic link
        </button>
      </div>

      {mode === 'password' ? (
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/reset-password"
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="magic-email">Email</Label>
            <Input id="magic-email" name="email" type="email" autoComplete="email" required />
          </div>
          {magicState?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{magicState.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={magicPending}>
            {magicPending ? 'Sending…' : 'Send magic link'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-[var(--foreground)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
