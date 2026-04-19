import { describe, it, expect } from 'vitest'
import { formatCurrency, slugify, truncate, generateId } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(195)).toBe('$195.00')
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })

  it('formats other currencies', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100')
  })
})

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Oud Rose Absolute')).toBe('oud-rose-absolute')
    expect(slugify("Fali's Perfume")).toBe('falis-perfume')
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('handles leading/trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello')
    expect(slugify('-test-')).toBe('test')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    const result = truncate('This is a long string', 10)
    expect(result.length).toBeLessThanOrEqual(11) // includes ellipsis
    expect(result.endsWith('…')).toBe(true)
  })

  it('returns short strings unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })

  it('generates alphanumeric IDs', () => {
    const id = generateId()
    expect(id).toMatch(/^[a-z0-9]+$/)
  })
})
