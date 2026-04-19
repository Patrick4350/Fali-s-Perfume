'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 rounded-full bg-[var(--background)]/90 opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto pr-4 pb-2 pl-4 sm:pr-6 sm:pl-6 lg:pr-8 lg:pl-8"
      >
        {children}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 rounded-full bg-[var(--background)]/90 opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
