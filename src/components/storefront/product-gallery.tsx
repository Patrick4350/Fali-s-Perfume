'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProductMedia } from '@/types'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  media: ProductMedia[]
  productName: string
}

export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir)
      setActiveIndex((prev) => (prev + dir + media.length) % media.length)
    },
    [media.length]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate(-1)
    if (e.key === 'ArrowRight') navigate(1)
  }

  const active = media[activeIndex]

  if (!media.length) {
    return (
      <div className="flex aspect-square items-center justify-center bg-[var(--muted)]">
        <span className="text-sm text-[var(--muted-foreground)]">No images</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative aspect-square cursor-default overflow-hidden rounded-sm bg-[var(--muted)]"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="img"
        aria-label={`${productName} — image ${activeIndex + 1} of ${media.length}`}
      >
        <AnimatePresence initial={false} custom={direction}>
          {active && (
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {active.type === 'video' ? (
                <video
                  src={active.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                  aria-label={active.alt_text ?? productName}
                />
              ) : (
                <Image
                  src={active.url}
                  alt={active.alt_text ?? productName}
                  fill
                  priority={activeIndex === 0}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(-1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-[var(--background)]/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-[var(--background)]/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1)
                setActiveIndex(i)
              }}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all',
                i === activeIndex
                  ? 'border-[var(--foreground)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              {item.type === 'video' ? (
                <video src={item.url} className="h-full w-full object-cover" muted />
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt_text ?? `${productName} — thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
