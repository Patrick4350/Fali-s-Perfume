'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: 'Your sign-in link has expired. Please request a new one.',
  access_denied: 'Access denied. Please try signing in again.',
  invalid_token: 'Invalid link. Please request a new one.',
}

export function AuthErrorHandler() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.replace('#', ''))
    const errorCode = params.get('error_code') ?? params.get('error')
    if (!errorCode) return

    const message = ERROR_MESSAGES[errorCode] ?? 'Something went wrong. Please try again.'
    window.history.replaceState(null, '', window.location.pathname)
    router.replace(`/login?error=${encodeURIComponent(message)}`)
  }, [router])

  return null
}
