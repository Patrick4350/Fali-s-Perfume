'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signUpSchema, signInSchema } from '@/lib/validation/auth'

export async function signUp(_prev: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  redirect('/verify?email=' + encodeURIComponent(parsed.data.email))
}

export async function signIn(_prev: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  const redirectTo = formData.get('redirectTo')?.toString()
  redirect(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/')
}

export async function signInWithMagicLink(_prev: unknown, formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  if (!email) return { error: 'Email is required' }

  const redirectTo = formData.get('redirectTo')?.toString()
  const next = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}` },
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(_prev: unknown, formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  if (!email) return { error: 'Email is required' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(_prev: unknown, formData: FormData) {
  const password = formData.get('password')?.toString()
  const confirm = formData.get('confirm')?.toString()

  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters' }
  if (password !== confirm) return { error: 'Passwords do not match' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  redirect('/account')
}
