import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Reset Password — Fali's" }

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-light">Reset password</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
