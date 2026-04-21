import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  const redirectTo = type === 'recovery' ? `${origin}/reset-password` : `${origin}${next}`

  if (!code) {
    return NextResponse.redirect(redirectTo)
  }

  // Build the response first so we can write cookies onto it
  const response = NextResponse.redirect(redirectTo)

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.exchangeCodeForSession(code)

  // If user is admin and no specific next, send them to admin dashboard
  if (data.user && next === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      return NextResponse.redirect(`${origin}/admin`, { headers: response.headers })
    }
  }

  return response
}
