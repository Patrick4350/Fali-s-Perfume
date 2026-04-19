import { describe, it, expect } from 'vitest'
import { signUpSchema } from '@/lib/validation/auth'
import { addToCartSchema } from '@/lib/validation/cart'
import { searchSchema } from '@/lib/validation/product'

describe('Auth validation', () => {
  describe('signUpSchema', () => {
    it('accepts valid input', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'Password1',
        full_name: 'Jane Doe',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = signUpSchema.safeParse({
        email: 'not-an-email',
        password: 'Password1',
        full_name: 'Jane Doe',
      })
      expect(result.success).toBe(false)
    })

    it('rejects weak passwords', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'weakpass',
        full_name: 'Jane Doe',
      })
      expect(result.success).toBe(false)
    })

    it('requires uppercase in password', () => {
      const result = signUpSchema.safeParse({
        email: 'user@example.com',
        password: 'password1',
        full_name: 'Jane Doe',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('Cart validation', () => {
  it('accepts valid add-to-cart input', () => {
    const result = addToCartSchema.safeParse({
      product_id: '00000000-0000-0000-0000-000000000001',
      variant_id: '00000000-0000-0000-0000-000000000002',
      quantity: 2,
    })
    expect(result.success).toBe(true)
  })

  it('rejects quantity over 99', () => {
    const result = addToCartSchema.safeParse({
      product_id: '00000000-0000-0000-0000-000000000001',
      variant_id: '00000000-0000-0000-0000-000000000002',
      quantity: 100,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID ids', () => {
    const result = addToCartSchema.safeParse({
      product_id: 'not-a-uuid',
      variant_id: '00000000-0000-0000-0000-000000000002',
      quantity: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('Search validation', () => {
  it('defaults page to 1', () => {
    const result = searchSchema.parse({ query: 'rose' })
    expect(result.page).toBe(1)
    expect(result.per_page).toBe(24)
  })

  it('clamps per_page to 100', () => {
    const result = searchSchema.safeParse({ query: 'rose', per_page: 200 })
    expect(result.success).toBe(false)
  })

  it('rejects query over 100 characters', () => {
    const result = searchSchema.safeParse({ query: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })
})
