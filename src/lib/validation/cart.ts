import { z } from 'zod'

export const addToCartSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid(),
  quantity: z.number().int().positive().max(99),
})

export const updateCartItemSchema = z.object({
  item_id: z.string().uuid(),
  quantity: z.number().int().min(0).max(99),
})

export const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  country: z.string().length(2, 'Country code must be 2 characters').default('US'),
  phone: z.string().optional(),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type AddressInput = z.infer<typeof addressSchema>
