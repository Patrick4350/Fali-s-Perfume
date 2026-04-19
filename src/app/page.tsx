import { redirect } from 'next/navigation'

// Root redirects to storefront homepage
export default function RootPage() {
  redirect('/')
}
