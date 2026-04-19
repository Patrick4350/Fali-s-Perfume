'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function HeroSection() {
  return (
    <section className="relative min-h-dvh overflow-hidden" aria-label="Hero">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=2000&auto=format&fit=crop&q=80"
          alt="Artisanal perfume bottle on marble surface"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-dvh max-w-7xl flex-col justify-end px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-4 text-xs font-medium tracking-[0.25em] text-amber-300 uppercase"
          >
            New Collection — Spring 2026
          </motion.p>

          <motion.h1
            custom={0.15}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif text-5xl leading-[1.1] font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            The Art of
            <br />
            <em>Scent</em>
          </motion.h1>

          <motion.p
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Perfumes composed from rare botanicals and living materials. Each bottle is a memory not
            yet made.
          </motion.p>

          <motion.div
            custom={0.45}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button asChild size="xl" variant="accent">
              <Link href="/perfume">
                Explore Perfume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link href="/clothing">View Clothing</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute right-8 bottom-8 hidden items-center gap-2 text-white/60 lg:flex"
      >
        <div className="h-12 w-px bg-white/30" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
