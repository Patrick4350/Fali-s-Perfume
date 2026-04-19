'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

const links = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/addresses', label: 'Addresses' },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="mb-8 lg:mb-0">
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors',
                pathname === href
                  ? 'bg-[var(--accent)]/10 font-medium text-[var(--accent)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              )}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <form action={signOut}>
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Sign out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
