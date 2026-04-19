import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Shop: [
    { label: 'Perfume', href: '/perfume' },
    { label: 'Clothing', href: '/clothing' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Gift Sets', href: '/gifts' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Journal', href: '/journal' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-light tracking-widest uppercase">
              Fali&apos;s
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
              Artisanal perfumes and refined clothing, crafted for those who appreciate the quiet
              luxury of intention.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold tracking-widest text-[var(--foreground)] uppercase">
                {category}
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} Fali&apos;s. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
