import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const journalPosts = [
  {
    slug: 'the-language-of-scent',
    title: 'The Language of Scent',
    excerpt: 'How fragrance communicates what words cannot — an exploration of olfactive memory.',
    image:
      'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?w=800&auto=format&fit=crop&q=80',
    category: 'Fragrance',
    date: 'April 2026',
  },
  {
    slug: 'natural-fabrics-guide',
    title: 'A Guide to Natural Fabrics',
    excerpt:
      'Linen, silk, merino, and cotton — understanding what your clothes are made of and why it matters.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    category: 'Clothing',
    date: 'March 2026',
  },
  {
    slug: 'botanical-ingredients',
    title: 'On Botanical Ingredients',
    excerpt:
      'The harvest cycles, sustainable sourcing, and chemistry behind our most beloved perfume notes.',
    image:
      'https://images.unsplash.com/photo-1562159278-1253a58da141?w=800&auto=format&fit=crop&q=80',
    category: 'Behind the Bottle',
    date: 'March 2026',
  },
]

export async function JournalStrip() {
  return (
    <section className="bg-[var(--muted)] py-20" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
              Stories
            </p>
            <h2
              id="journal-heading"
              className="mt-2 font-serif text-3xl font-light tracking-tight sm:text-4xl"
            >
              The Journal
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] sm:flex"
          >
            All articles
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {journalPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group block"
              aria-label={`Read: ${post.title}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--border)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-1.5 font-serif text-xl leading-snug font-light underline-offset-2 group-hover:underline">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
