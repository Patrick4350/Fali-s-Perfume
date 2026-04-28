import { test, expect } from '@playwright/test'

const categories = [
  { name: 'Perfume', href: '/perfume' },
  { name: 'Clothing', href: '/clothing' },
  { name: 'Bags', href: '/bags' },
  { name: 'New Arrivals', href: '/new-arrivals' },
]

for (const { name, href } of categories) {
  test(`${name} category page loads`, async ({ page }) => {
    await page.goto(href)
    await expect(page).toHaveURL(href)
    await expect(page.getByRole('heading', { name, exact: false })).toBeVisible()
  })
}

test('category page shows product grid or empty state', async ({ page }) => {
  await page.goto('/perfume')
  const grid = page.locator('[data-testid="product-grid"], article, .group')
  const empty = page.getByText(/no products/i)
  await expect(grid.first().or(empty)).toBeVisible()
})
