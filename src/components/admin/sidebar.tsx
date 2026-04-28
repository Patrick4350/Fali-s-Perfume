'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  AlertTriangle,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory', href: '/admin/inventory', icon: AlertTriangle },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!show) return null

  return (
    <aside className="flex w-56 flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
        <Link href="/admin" className="font-serif text-base font-light tracking-widest uppercase">
          Fali&apos;s
        </Link>
        <span className="ml-2 rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
          Admin
        </span>
      </div>

      <nav className="flex-1 py-4" aria-label="Admin navigation">
        <ul className="space-y-0.5 px-2" role="list">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--muted)] font-medium text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <Link
          href="/"
          className="text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  )
}
