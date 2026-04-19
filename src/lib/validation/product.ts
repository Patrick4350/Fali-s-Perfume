import { z } from 'zod'

export const productVariantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  price_override: z.number().positive().nullable().optional(),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
  is_active: z.boolean().default(true),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().nullable().optional(),
  brand: z.string().min(1, 'Brand is required'),
  category_id: z.string().uuid('Invalid category'),
  base_price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  is_published: z.boolean().default(false),
  featured: z.boolean().default(false),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
  attributes: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
})

export const searchSchema = z.object({
  query: z.string().max(100),
  category: z.string().optional(),
  min_price: z.number().nonnegative().optional(),
  max_price: z.number().positive().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  in_stock: z.boolean().optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'best_selling']).optional(),
  page: z.number().int().positive().default(1),
  per_page: z.number().int().positive().max(100).default(24),
})

export type ProductInput = z.infer<typeof productSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
export type SearchInput = z.infer<typeof searchSchema>
