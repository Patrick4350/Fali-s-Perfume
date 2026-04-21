'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { usePostHog } from 'posthog-js/react'
import { Events } from '@/lib/analytics-events'

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const ph = usePostHog()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="border-b border-[var(--border)] px-6 py-4">
          <SheetTitle className="font-serif text-lg font-light tracking-wide">
            Your Cart {items.length > 0 && `(${items.length})`}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
            <ShoppingBag className="h-12 w-12 text-[var(--muted-foreground)]" strokeWidth={1} />
            <p className="text-center text-[var(--muted-foreground)]">Your cart is empty</p>
            <Button variant="outline" size="sm" asChild onClick={closeCart}>
              <Link href="/perfume">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const price = item.product_variants.price_override ?? item.products.base_price
                  const image = item.products.product_media?.[0]

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 py-4"
                    >
                      {image ? (
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[var(--muted)]">
                          <Image
                            src={image.url}
                            alt={image.alt_text ?? item.products.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-16 flex-shrink-0 rounded bg-[var(--muted)]" />
                      )}

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm leading-tight font-medium">{item.products.name}</p>
                          {item.product_variants.size && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                              {item.product_variants.size}
                              {item.product_variants.color && ` / ${item.product_variants.color}`}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium">{formatCurrency(price)}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                            className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="space-y-4 border-t border-[var(--border)] px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-base font-medium">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Shipping and taxes calculated at checkout
              </p>
              <Separator />
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  asChild
                  onClick={() => {
                    ph.capture(Events.CHECKOUT_STARTED, {
                      item_count: items.length,
                      total,
                      items: items.map((i) => ({
                        product_id: i.product_id,
                        product_name: i.products.name,
                        variant_id: i.variant_id,
                        quantity: i.quantity,
                        price: i.product_variants.price_override ?? i.products.base_price,
                      })),
                    })
                    closeCart()
                  }}
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild onClick={closeCart}>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
