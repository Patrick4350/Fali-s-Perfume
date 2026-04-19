import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountNav } from '@/components/account/account-nav'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/account')

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-light">My account</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{user.email}</p>
      </div>
      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
        <AccountNav />
        <main>{children}</main>
      </div>
    </div>
  )
}
