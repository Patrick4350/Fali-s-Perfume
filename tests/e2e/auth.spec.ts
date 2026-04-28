import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /sign in|log in|welcome/i })).toBeVisible()
  })

  test('login page has email input', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
  })

  test('account page redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/account')
    await expect(page).toHaveURL(/login/)
  })

  test('wishlist page redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/account/wishlist')
    await expect(page).toHaveURL(/login/)
  })
})
