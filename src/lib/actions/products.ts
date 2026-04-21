'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function createProduct(_prev: unknown, formData: FormData) {
  const supabase = await createAdminClient()

  const name = formData.get('name')?.toString().trim() ?? ''
  const brand = formData.get('brand')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString() ?? ''
  const base_price = Number(formData.get('base_price'))
  const category_id = formData.get('category_id')?.toString() ?? ''
  const is_published = formData.get('is_published') === 'true'
  const featured = formData.get('featured') === 'true'

  if (!name || !category_id || isNaN(base_price)) {
    return { error: 'Name, category and price are required' }
  }

  const slug = slugify(name)

  const { data: product, error } = await supabase
    .from('products')
    .insert({ name, slug, brand, description, base_price, category_id, is_published, featured })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  redirect(`/admin/products/${product.id}/edit`)
}

export async function updateProduct(_prev: unknown, formData: FormData) {
  const supabase = await createAdminClient()
  const id = formData.get('id')?.toString() ?? ''
  const name = formData.get('name')?.toString().trim() ?? ''
  const brand = formData.get('brand')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString() ?? ''
  const base_price = Number(formData.get('base_price'))
  const category_id = formData.get('category_id')?.toString() ?? ''
  const is_published = formData.get('is_published') === 'true'
  const featured = formData.get('featured') === 'true'

  if (!id || !name || !category_id || isNaN(base_price)) {
    return { error: 'Invalid form data' }
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      brand,
      description,
      base_price,
      category_id,
      is_published,
      featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath(`/products/${formData.get('slug')}`)
  revalidatePath('/')
  revalidatePath('/new-arrivals')
  revalidatePath('/perfume')
  revalidatePath('/clothing')
  revalidatePath('/bags')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/new-arrivals')
}

export async function upsertVariant(_prev: unknown, formData: FormData) {
  const supabase = await createAdminClient()
  const product_id = formData.get('product_id')?.toString() ?? ''
  const id = formData.get('id')?.toString() || undefined
  const sku = formData.get('sku')?.toString().trim() ?? ''
  const size = formData.get('size')?.toString().trim() || null
  const color = formData.get('color')?.toString().trim() || null
  const price_override = formData.get('price_override')
    ? Number(formData.get('price_override'))
    : null
  const stock_quantity = Number(formData.get('stock_quantity') ?? 0)
  const is_active = formData.get('is_active') !== 'false'

  if (!product_id || !sku) return { error: 'Product ID and SKU are required' }

  if (id) {
    const { error } = await supabase
      .from('product_variants')
      .update({ sku, size, color, price_override, stock_quantity, is_active })
      .eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('product_variants')
      .insert({ product_id, sku, size, color, price_override, stock_quantity, is_active })
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/products/${product_id}/edit`)
  return { success: true }
}

export async function deleteVariant(id: string, productId: string) {
  const supabase = await createAdminClient()
  await supabase.from('product_variants').delete().eq('id', id)
  revalidatePath(`/admin/products/${productId}/edit`)
}

export async function upsertAttribute(_prev: unknown, formData: FormData) {
  const supabase = await createAdminClient()
  const product_id = formData.get('product_id')?.toString() ?? ''
  const id = formData.get('id')?.toString() || undefined
  const key = formData.get('key')?.toString().trim() ?? ''
  const value = formData.get('value')?.toString().trim() ?? ''

  if (!product_id || !key || !value) return { error: 'Key and value are required' }

  if (id) {
    const { error } = await supabase.from('product_attributes').update({ key, value }).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('product_attributes').insert({ product_id, key, value })
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/products/${product_id}/edit`)
  return { success: true }
}

export async function deleteAttribute(id: string, productId: string) {
  const supabase = await createAdminClient()
  await supabase.from('product_attributes').delete().eq('id', id)
  revalidatePath(`/admin/products/${productId}/edit`)
}

export async function uploadProductMedia(formData: FormData) {
  const supabase = await createAdminClient()
  const file = formData.get('file') as File
  const product_id = formData.get('product_id')?.toString() ?? ''
  const position = Number(formData.get('position') ?? 0)

  if (!file || !product_id) return { error: 'File and product ID required' }

  const ext = file.name.split('.').pop()
  const path = `products/${product_id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-media')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { data: urlData } = supabase.storage.from('product-media').getPublicUrl(path)

  const { error: dbError } = await supabase.from('product_media').insert({
    product_id,
    url: urlData.publicUrl,
    type: (file.type.startsWith('video') ? 'video' : 'image') as 'image' | 'video',
    sort_order: position,
  })

  if (dbError) return { error: dbError.message }

  revalidatePath(`/admin/products/${product_id}/edit`)
  return { success: true, url: urlData.publicUrl }
}
