'use client'

import { Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function AdminHeader({ user }: { user: { name: string; email: string } }) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-6">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--muted-foreground)]">{user.email}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-3.5 w-3.5 dark:hidden" />
          <Moon className="hidden h-3.5 w-3.5 dark:block" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleSignOut} aria-label="Sign out">
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  )
}
