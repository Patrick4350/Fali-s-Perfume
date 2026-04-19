'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

const RECENT_KEY = 'falis-recent-searches'
const MAX_RECENT = 5

function getRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveRecent(query: string) {
  if (typeof window === 'undefined') return
  const prev = getRecent().filter((q) => q !== query)
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)))
}

interface SearchInputProps {
  defaultValue?: string
}

export function SearchInput({ defaultValue = '' }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue)
  const [recent, setRecent] = useState<string[]>([])
  const [showRecent, setShowRecent] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRecent(getRecent())
  }, [])

  const navigate = useCallback(
    (q: string) => {
      if (q.trim()) {
        saveRecent(q.trim())
        setRecent(getRecent())
      }
      router.push(`/search?q=${encodeURIComponent(q.trim())}`, { scroll: false })
    },
    [router]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setValue(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (pathname === '/search') navigate(q)
    }, 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      navigate(value)
      setShowRecent(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setShowRecent(false)
      inputRef.current?.blur()
    }
  }

  const clear = () => {
    setValue('')
    inputRef.current?.focus()
    if (pathname === '/search') router.push('/search')
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--ring)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search perfumes, clothing…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowRecent(true)}
          onBlur={() => setTimeout(() => setShowRecent(false), 150)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          aria-label="Search"
          autoFocus
        />
        {value && (
          <button onClick={clear} aria-label="Clear search">
            <X className="h-4 w-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" />
          </button>
        )}
      </div>

      {showRecent && recent.length > 0 && !value && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg">
          <p className="px-3 pt-2 text-xs font-medium tracking-widest text-[var(--muted-foreground)] uppercase">
            Recent
          </p>
          {recent.map((q) => (
            <button
              key={q}
              onMouseDown={() => {
                setValue(q)
                navigate(q)
                setShowRecent(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
            >
              <Search className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
