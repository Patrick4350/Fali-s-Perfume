import { Header } from '@/components/storefront/header'
import { Footer } from '@/components/storefront/footer'
import { CartDrawer } from '@/components/storefront/cart-drawer'
import { StorefrontCurrencyProvider } from '@/components/storefront/currency-provider'
import { getStoreCurrency } from '@/lib/currency'

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const currency = await getStoreCurrency()

  return (
    <StorefrontCurrencyProvider currency={currency}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </StorefrontCurrencyProvider>
  )
}
