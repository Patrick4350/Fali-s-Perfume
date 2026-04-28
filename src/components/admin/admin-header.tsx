'use client'

import {
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
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

export function AdminHeader({ user }: { user: { name: string; email: string } }) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsWide(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
        {/* Mobile: logo + hamburger */}
        <div className={`flex items-center gap-3 ${isWide ? 'hidden' : ''}`}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Link href="/admin" className="font-serif text-sm font-light tracking-widest uppercase">
            Fali&apos;s{' '}
            <span className="ml-1 rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
              Admin
            </span>
          </Link>
        </div>

        <div />

        <div className="flex items-center gap-3">
          {isWide && <span className="text-xs text-[var(--muted-foreground)]">{user.email}</span>}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <nav
            className="absolute inset-y-0 left-0 w-64 bg-[var(--card)] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center border-b border-[var(--border)] px-4">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="font-serif text-base font-light tracking-widest uppercase"
              >
                Fali&apos;s
              </Link>
              <span className="ml-2 rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                Admin
              </span>
            </div>
            <ul className="space-y-0.5 px-2 py-4" role="list">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'bg-[var(--muted)] font-medium text-[var(--foreground)]'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="absolute right-0 bottom-0 left-0 border-t border-[var(--border)] p-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ← Back to Store
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
