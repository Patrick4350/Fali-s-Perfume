import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { CurrencyProvider } from '@/components/admin/currency-provider'
import { getStoreCurrency } from '@/lib/currency'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/admin')

  const [{ data: profile }, currency] = await Promise.all([
    supabase.from('profiles').select('role, full_name, email').eq('id', user.id).single(),
    getStoreCurrency(),
  ])

  if (profile?.role !== 'admin') redirect('/login?redirectTo=/admin&error=Admin+access+only')

  return (
    <CurrencyProvider currency={currency}>
      <div className="flex h-dvh overflow-hidden bg-[var(--background)]">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader user={{ name: profile.full_name ?? profile.email, email: profile.email }} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </CurrencyProvider>
  )
}
