import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cart'
import type { CartItemWithProduct } from '@/types'

function makeItem(overrides: Partial<CartItemWithProduct> = {}): CartItemWithProduct {
  return {
    id: 'item-1',
    cart_id: 'cart-1',
    product_id: 'prod-1',
    variant_id: 'var-1',
    quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    products: {
      id: 'prod-1',
      slug: 'test-product',
      name: 'Test Product',
      description: null,
      brand: 'Test Brand',
      category_id: 'cat-1',
      base_price: 100,
      currency: 'USD',
      is_published: true,
      featured: false,
      search_vector: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_media: [],
    },
    product_variants: {
      id: 'var-1',
      product_id: 'prod-1',
      sku: 'SKU-001',
      size: '50ml',
      color: null,
      price_override: null,
      stock_quantity: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    ...overrides,
  }
}

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false, sessionId: null })
  })

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(makeItem())
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('increments quantity when adding duplicate variant', () => {
    useCartStore.getState().addItem(makeItem({ quantity: 1 }))
    useCartStore.getState().addItem(makeItem({ quantity: 2 }))
    expect(useCartStore.getState().items[0]?.quantity).toBe(3)
  })

  it('removes an item', () => {
    useCartStore.getState().addItem(makeItem())
    useCartStore.getState().removeItem('item-1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    useCartStore.getState().addItem(makeItem())
    useCartStore.getState().updateQuantity('item-1', 5)
    expect(useCartStore.getState().items[0]?.quantity).toBe(5)
  })

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem(makeItem())
    useCartStore.getState().updateQuantity('item-1', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(makeItem({ quantity: 2 }))
    expect(useCartStore.getState().total()).toBe(200)
  })

  it('calculates total with price override', () => {
    const item = makeItem({
      quantity: 2,
      product_variants: {
        id: 'var-1',
        product_id: 'prod-1',
        sku: 'SKU-001',
        size: '50ml',
        color: null,
        price_override: 75,
        stock_quantity: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
    useCartStore.getState().addItem(item)
    expect(useCartStore.getState().total()).toBe(150)
  })

  it('counts items correctly', () => {
    useCartStore.getState().addItem(makeItem({ id: 'item-1', quantity: 3 }))
    useCartStore.getState().addItem(makeItem({ id: 'item-2', variant_id: 'var-2', quantity: 2 }))
    expect(useCartStore.getState().itemCount()).toBe(5)
  })

  it('clears cart', () => {
    useCartStore.getState().addItem(makeItem())
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('toggles cart visibility', () => {
    expect(useCartStore.getState().isOpen).toBe(false)
    useCartStore.getState().openCart()
    expect(useCartStore.getState().isOpen).toBe(true)
    useCartStore.getState().closeCart()
    expect(useCartStore.getState().isOpen).toBe(false)
  })
})
