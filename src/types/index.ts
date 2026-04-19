import type { Database } from './database'

export type { Database }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductMedia = Database['public']['Tables']['product_media']['Row']
export type ProductAttribute = Database['public']['Tables']['product_attributes']['Row']
export type Cart = Database['public']['Tables']['carts']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']

export type ProductWithMedia = Product & {
  product_media: ProductMedia[]
  categories: Category
  product_variants: ProductVariant[]
  product_attributes: ProductAttribute[]
}

export type CartItemWithProduct = CartItem & {
  products: Product & { product_media: ProductMedia[] }
  product_variants: ProductVariant
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'best_selling'

export type FilterState = {
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  inStockOnly?: boolean
  sort?: SortOption
}
