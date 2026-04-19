'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'perfume',
    label: 'Perfume',
    tagline: 'Rare botanicals, living materials',
    description:
      'Each fragrance is a composition — layered, intentional, and made to linger. From eau de parfum to pure extrait.',
    href: '/perfume',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Collection of artisanal perfume bottles',
    accent: 'amber',
    cta: 'Explore Fragrances',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    tagline: 'Refined, considered, enduring',
    description:
      'Garments designed to move with you — crafted from natural fabrics with details that reward a second look.',
    href: '/clothing',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop&q=80',
    imageAlt: 'Editorial clothing laid flat on neutral surface',
    accent: 'sage',
    cta: 'View Collection',
  },
]

export function CategorySplit() {
  return (
    <section aria-labelledby="categories-heading" className="py-8">
      <h2 id="categories-heading" className="sr-only">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.imageAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <p
                className={`text-xs font-medium tracking-[0.2em] uppercase ${
                  cat.accent === 'amber' ? 'text-amber-300' : 'text-[oklch(80%_0.05_155)]'
                }`}
              >
                {cat.tagline}
              </p>

              <h3 className="mt-2 font-serif text-4xl font-light text-white lg:text-5xl">
                {cat.label}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                {cat.description}
              </p>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-6 w-fit border-white/40 text-white hover:bg-white/10"
              >
                <Link href={cat.href}>
                  {cat.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
