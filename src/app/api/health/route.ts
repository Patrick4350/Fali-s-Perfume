import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const start = Date.now()

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('categories').select('id').limit(1)

    const latency = Date.now() - start

    if (error) {
      return NextResponse.json(
        { status: 'degraded', db: 'error', error: error.message, latency },
        { status: 503 }
      )
    }

    return NextResponse.json({ status: 'ok', db: 'connected', latency })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'unreachable', latency: Date.now() - start },
      { status: 503 }
    )
  }
}
