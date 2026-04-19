'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemWithProduct } from '@/types'

type CartStore = {
  items: CartItemWithProduct[]
  isOpen: boolean
  sessionId: string | null

  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  addItem: (item: CartItemWithProduct) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setSessionId: (id: string) => void

  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      sessionId: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.variant_id === newItem.variant_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variant_id === newItem.variant_id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== itemId)
              : state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      setSessionId: (id) => set({ sessionId: id }),

      total: () => {
        const { items } = get()
        return items.reduce((sum, item) => {
          const price = item.product_variants.price_override ?? item.products.base_price
          return sum + price * item.quantity
        }, 0)
      },

      itemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'falis-cart',
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
)
