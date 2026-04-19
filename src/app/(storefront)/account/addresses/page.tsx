import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: "Addresses — Fali's" }

export default async function AddressesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user!.id)
    .order('is_default', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Saved addresses</h2>
      </div>

      {!addresses?.length ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          No saved addresses. Addresses are saved automatically at checkout.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-lg border border-[var(--border)] p-4 text-sm">
              {address.is_default && (
                <span className="mb-2 inline-block rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                  Default
                </span>
              )}
              <p className="font-medium">{address.full_name}</p>
              <p className="mt-1 text-[var(--muted-foreground)]">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
              </p>
              <p className="text-[var(--muted-foreground)]">
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p className="text-[var(--muted-foreground)]">{address.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
