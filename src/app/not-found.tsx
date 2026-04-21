'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const links = [
  { label: 'Perfume', href: '/perfume' },
  { label: 'Clothing', href: '/clothing' },
  { label: 'Bags', href: '/bags' },
  { label: 'New Arrivals', href: '/new-arrivals' },
]

const floatingNotes = [
  { label: 'Oud', x: '12%', y: '22%', delay: 0 },
  { label: 'Amber', x: '78%', y: '15%', delay: 0.4 },
  { label: 'Neroli', x: '65%', y: '72%', delay: 0.8 },
  { label: 'Vetiver', x: '8%', y: '68%', delay: 0.2 },
  { label: 'Musk', x: '88%', y: '52%', delay: 1.1 },
  { label: 'Rose', x: '42%', y: '85%', delay: 0.6 },
]

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Warm ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-rose-300/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/6 blur-[80px]" />
      </div>

      {/* Floating fragrance notes */}
      {floatingNotes.map((note) => (
        <motion.span
          key={note.label}
          className="pointer-events-none absolute hidden font-serif text-xs text-[var(--muted-foreground)]/40 italic select-none md:block"
          style={{ left: note.x, top: note.y }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: [8, 0, 8] }}
          transition={{
            opacity: { duration: 0.8, delay: note.delay },
            y: { duration: 5, delay: note.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {note.label}
        </motion.span>
      ))}

      {/* Decorative scent rings */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[var(--border)]"
            style={{ width: i * 180, height: i * 180 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1 / (i * 1.5), scale: 1 }}
            transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-1"
      >
        <p className="font-serif text-xs tracking-[0.3em] text-amber-500/80 uppercase">
          Fali&apos;s
        </p>
        <p className="font-serif text-[11rem] leading-none font-light text-[var(--foreground)]/[0.07] md:text-[16rem]">
          404
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="-mt-6 space-y-4"
      >
        <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
          Lost among the notes
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
          This page has evaporated — like a top note on warm skin. Let us guide you somewhere
          beautiful.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <Button asChild size="lg">
          <Link href="/">
            Return home
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/perfume">Shop perfume</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-6"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            {l.label}
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
