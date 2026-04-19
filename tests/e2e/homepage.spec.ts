import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByLabel('Open cart')).toBeVisible()
  })

  test('navigates to perfume category', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Perfume' }).first().click()
    await expect(page).toHaveURL('/perfume')
    await expect(page.getByRole('heading', { name: 'Perfume' })).toBeVisible()
  })

  test('navigates to clothing category', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Clothing' }).first().click()
    await expect(page).toHaveURL('/clothing')
  })
})

test.describe('Cart', () => {
  test('opens and closes cart drawer', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(/open cart/i).click()
    await expect(page.getByText(/your cart/i)).toBeVisible()
    await page.getByLabel(/close/i).click()
    await expect(page.getByText(/your cart/i)).not.toBeVisible()
  })

  test('shows empty state when cart is empty', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(/open cart/i).click()
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })
})

test.describe('Search', () => {
  test('navigates to search page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Search' }).click()
    await expect(page).toHaveURL('/search')
  })
})

test.describe('Health', () => {
  test('/api/health returns ok', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBeLessThan(503)
    const body = await response.json()
    expect(body).toHaveProperty('status')
  })
})
