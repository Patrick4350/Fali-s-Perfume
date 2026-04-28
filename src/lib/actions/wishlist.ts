'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(
  productId: string
): Promise<{ wishlisted: boolean; error?: string; requiresLogin?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { wishlisted: false, requiresLogin: true }

  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
    revalidatePath('/account/wishlist')
    return { wishlisted: false }
  } else {
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, product_id: productId })
    if (error) return { wishlisted: false, error: error.message }
    revalidatePath('/account/wishlist')
    return { wishlisted: true }
  }
}

export async function getWishlistStatus(productId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  return !!data
}
