import { createAdminClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers — Admin' }

export default async function AdminCustomersPage() {
  const supabase = await createAdminClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  // Get order counts per user
  const { data: orderCounts } = await supabase
    .from('orders')
    .select('user_id')
    .in('user_id', (profiles ?? []).map((p) => p.id).filter(Boolean))

  const countMap = new Map<string, number>()
  for (const order of orderCounts ?? []) {
    if (order.user_id) countMap.set(order.user_id, (countMap.get(order.user_id) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Customers</h1>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Orders</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{profile.full_name ?? '(no name)'}</p>
                  <p className="font-mono text-xs text-[var(--muted-foreground)]">
                    {profile.id.slice(0, 8)}…
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      profile.role === 'admin'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    {profile.role}
                  </span>
                </td>
                <td className="px-4 py-3">{countMap.get(profile.id) ?? 0}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!profiles?.length && (
          <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No customers yet.
          </p>
        )}
      </div>
    </div>
  )
}
