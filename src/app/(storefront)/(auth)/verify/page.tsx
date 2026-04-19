import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Check Your Email — Fali's" }

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-20">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <svg
            className="h-7 w-7 text-[var(--accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-light">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          We&apos;ve sent a confirmation link to{' '}
          {email ? <strong className="text-[var(--foreground)]">{email}</strong> : 'your email'}.
          Click the link to activate your account.
        </p>
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          Didn&apos;t receive it? Check your spam folder or try signing up again.
        </p>
      </div>
    </div>
  )
}
