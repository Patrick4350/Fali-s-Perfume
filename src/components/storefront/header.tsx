'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, Sun, Moon, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePostHog } from 'posthog-js/react'
import { Events } from '@/lib/analytics-events'

const navLinks = [
  { label: 'Perfume', href: '/perfume' },
  { label: 'Clothing', href: '/clothing' },
  { label: 'Bags', href: '/bags' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Journal', href: '/journal' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const { theme, setTheme } = useTheme()
  const itemCount = useCartStore((s) => s.itemCount())
  const openCart = useCartStore((s) => s.openCart)
  const ph = usePostHog()

  useEffect(() => {
    setMounted(true)
    const check = () => setIsWide(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          isScrolled
            ? 'border-b border-[var(--border)] bg-[var(--background)]/95 shadow-sm backdrop-blur-md'
            : 'bg-[var(--background)]/60 backdrop-blur-sm'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="font-serif text-xl font-light tracking-widest uppercase"
            aria-label="Fali's home"
          >
            Fali&apos;s
          </Link>

          {/* Desktop nav */}
          {isWide && (
            <ul className="flex items-center gap-6" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm tracking-wide text-[var(--foreground)] transition-colors duration-200 hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isWide && (
              <Button variant="ghost" size="icon-sm" asChild aria-label="Search">
                <Link href="/search">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
            )}

            {isWide && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={
                  mounted
                    ? theme === 'dark'
                      ? 'Switch to light mode'
                      : 'Switch to dark mode'
                    : 'Toggle theme'
                }
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                ph.capture(Events.CART_OPENED, { item_count: itemCount })
                openCart()
              }}
              aria-label={mounted ? `Open cart (${itemCount} items)` : 'Open cart'}
              className="relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {mounted && itemCount > 0 && (
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
              className={isWide ? 'hidden' : ''}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {mounted ? (
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            {/* Slide-in panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-40 flex w-80 max-w-[85vw] flex-col bg-[var(--background)] shadow-2xl md:hidden"
            >
              {/* Panel header */}
              <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="font-serif text-lg font-light tracking-widest uppercase"
                >
                  Fali&apos;s
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="rounded-md p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="space-y-1" role="list">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="group flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <Link
                    href="/search"
                    onClick={closeMenu}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3.5 text-base font-medium text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Link>
                </div>
              </nav>

              {/* Panel footer */}
              <div className="border-t border-[var(--border)] px-6 py-5">
                <div className="flex items-center justify-between">
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    My account
                  </Link>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  >
                    {mounted && theme === 'dark' ? (
                      <>
                        <Sun className="h-3.5 w-3.5" /> Light
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5" /> Dark
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
