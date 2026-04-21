'server only'

import { PostHog } from 'posthog-node'

// Server-side PostHog client — only import this in Server Components / Server Actions
export const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  flushAt: 1,
  flushInterval: 0,
})

export { Events } from './analytics-events'
