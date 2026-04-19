import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Sign In — Fali's" }

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-light">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Sign in to your Fali&apos;s account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
