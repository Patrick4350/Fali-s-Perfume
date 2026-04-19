import { SignUpForm } from '@/components/auth/signup-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Create Account — Fali's" }

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-light">Create account</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Join Fali&apos;s to save your favourites and track orders
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
