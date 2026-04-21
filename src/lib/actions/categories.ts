'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function createCategory(_prev: unknown, formData: FormData) {
  const supabase = await createAdminClient()
  const name = formData.get('name')?.toString().trim() ?? ''
  const type = formData.get('type')?.toString() ?? ''
  const description = formData.get('description')?.toString() ?? ''
  const parent_id = formData.get('parent_id')?.toString() || null

  if (!name || !type) return { error: 'Name and type are required' }

  const slug = slugify(name)
  const { error } = await supabase
    .from('categories')
    .insert({ slug, name, type: type as 'perfume' | 'clothing' | 'bags', description, parent_id })

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categories')
}
