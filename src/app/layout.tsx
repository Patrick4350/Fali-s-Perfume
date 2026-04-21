import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { AuthErrorHandler } from '@/components/auth/auth-error-handler'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

export const metadata: Metadata = {
  title: {
    default: "Fali's — Perfume & Clothing",
    template: "%s | Fali's",
  },
  description:
    'Discover an elevated collection of artisanal perfumes and refined clothing. Curated with intention, worn with confidence.',
  keywords: ['perfume', 'fragrance', 'clothing', 'fashion', 'luxury', 'artisanal'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Fali's",
    title: "Fali's — Perfume & Clothing",
    description: 'Discover an elevated collection of artisanal perfumes and refined clothing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fali's — Perfume & Clothing",
    description: 'Discover an elevated collection of artisanal perfumes and refined clothing.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <QueryProvider>
              <AuthErrorHandler />
              {children}
            </QueryProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
