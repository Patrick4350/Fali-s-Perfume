'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { addToCartSchema } from '@/lib/validation/cart'

export async function createCheckoutSession(
  items: { variant_id: string; quantity: number; product_id: string }[],
  cartId?: string | null
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!items.length) return { error: 'Cart is empty' }

  // Validate items and fetch prices
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, sku, price_override, stock_quantity, products(name, base_price, slug)')
    .in(
      'id',
      items.map((i) => i.variant_id)
    )

  if (!variants?.length) return { error: 'Invalid cart items' }

  const lineItems = items.flatMap((item) => {
    const variant = variants.find((v) => v.id === item.variant_id)
    if (!variant) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = variant.products as any
    const price = variant.price_override ?? product?.base_price ?? 0
    return [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: product?.name ?? variant.sku,
            metadata: { variant_id: variant.id, sku: variant.sku },
          },
        },
        quantity: item.quantity,
      },
    ]
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'NG'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Standard shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: 'usd' },
          display_name: 'Express shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ],
    metadata: {
      user_id: user?.id ?? '',
      cart_id: cartId ?? '',
      email: user?.email ?? '',
    },
    customer_email: user?.email,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
  })

  if (!session.url) return { error: 'Could not create checkout session' }
  redirect(session.url)
}

export async function addToCart(_prev: unknown, formData: FormData) {
  const parsed = addToCartSchema.safeParse({
    product_id: formData.get('product_id'),
    variant_id: formData.get('variant_id'),
    quantity: Number(formData.get('quantity') ?? 1),
  })
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Invalid' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Sign in to save your cart' }

  let { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single()

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()
    cart = newCart
  }

  if (!cart) return { error: 'Could not create cart' }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('variant_id', parsed.data.variant_id)
    .single()

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + parsed.data.quantity })
      .eq('id', existing.id)
  } else {
    await supabase.from('cart_items').insert({
      cart_id: cart.id,
      product_id: parsed.data.product_id,
      variant_id: parsed.data.variant_id,
      quantity: parsed.data.quantity,
    })
  }

  return { success: true }
}
