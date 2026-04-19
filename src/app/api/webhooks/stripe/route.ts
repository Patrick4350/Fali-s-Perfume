import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon'
  const { success } = rateLimit(`webhook:${ip}`, 60, 60_000)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const body = await req.text()
  const headerList = await headers()
  const sig = headerList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Idempotency — check if order already exists for this session
        const { data: existing } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .single()

        if (existing) break

        // Retrieve full session with line items (for future line item processing)
        await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product'],
        })

        const metadata = session.metadata ?? {}
        const userId = metadata['user_id'] ?? null
        const cartId = metadata['cart_id'] ?? null

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            status: 'paid' as const,
            stripe_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            email: session.customer_details?.email ?? metadata['email'] ?? '',
            subtotal: (session.amount_subtotal ?? 0) / 100,
            shipping: (session.shipping_cost?.amount_total ?? 0) / 100,
            tax: (session.total_details?.amount_tax ?? 0) / 100,
            total: (session.amount_total ?? 0) / 100,
            currency: session.currency?.toUpperCase() ?? 'USD',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shipping_address: (session.shipping_details?.address as any) ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            billing_address: (session.customer_details?.address as any) ?? null,
          })
          .select()
          .single()

        if (orderError || !order) {
          console.error('Failed to create order:', orderError)
          break
        }

        // Create order items from cart
        if (cartId) {
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select('*, products(*), product_variants(*)')
            .eq('cart_id', cartId)

          if (cartItems?.length) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items = cartItems.map((item: any) => ({
              order_id: order.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              product_name: item.products?.name ?? '',
              variant_sku: item.product_variants?.sku ?? '',
              variant_size: item.product_variants?.size ?? null,
              variant_color: item.product_variants?.color ?? null,
              quantity: item.quantity,
              unit_price: item.product_variants?.price_override ?? item.products?.base_price ?? 0,
              total_price:
                (item.product_variants?.price_override ?? item.products?.base_price ?? 0) *
                item.quantity,
            }))

            await supabase.from('order_items').insert(items)

            // Clear cart
            await supabase.from('carts').delete().eq('id', cartId)
          }
        }

        // Log to audit
        await supabase.from('audit_log').insert({
          action: 'order_created',
          table_name: 'orders',
          record_id: order.id,
          after_data: { status: 'paid', stripe_session_id: session.id },
        })

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await supabase
          .from('orders')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('stripe_session_id', session.id)
          .eq('status', 'pending')
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          await supabase
            .from('orders')
            .update({ status: 'refunded', updated_at: new Date().toISOString() })
            .eq('stripe_payment_intent_id', charge.payment_intent)
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
