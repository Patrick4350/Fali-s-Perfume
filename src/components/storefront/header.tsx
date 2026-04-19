'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Perfume', href: '/perfume' },
  { label: 'Clothing', href: '/clothing' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Journal', href: '/journal' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const itemCount = useCartStore((s) => s.itemCount())
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        isScrolled
          ? 'border-b border-[var(--border)] bg-[var(--background)]/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-light tracking-widest uppercase"
          aria-label="Fali's home"
        >
          Fali&apos;s
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm tracking-wide text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label="Search"
            className="hidden md:flex"
          >
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hidden md:flex"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={openCart}
            aria-label={`Open cart (${itemCount} items)`}
            className="relative"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-semibold text-[var(--accent-foreground)]"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-[var(--border)] bg-[var(--background)] md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-base font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-3 text-base font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
