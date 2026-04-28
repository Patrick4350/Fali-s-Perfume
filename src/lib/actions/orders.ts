'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/account/orders')
  return {}
}
