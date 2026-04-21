import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Sign In — Fali's" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}) {
  const { redirectTo, error } = await searchParams

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-light">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Sign in to your Fali&apos;s account
          </p>
        </div>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}
