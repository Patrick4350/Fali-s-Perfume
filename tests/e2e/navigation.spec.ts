import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('logo links to homepage', async ({ page }) => {
    await page.goto('/perfume')
    await page.getByRole('link', { name: /fali/i }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/this-does-not-exist-xyz')
    await expect(page).toHaveURL('/this-does-not-exist-xyz')
    const status = page.getByText(/404|not found|lost/i)
    await expect(status).toBeVisible()
  })

  test('header is visible on all main pages', async ({ page }) => {
    for (const path of ['/', '/perfume', '/clothing', '/bags', '/search']) {
      await page.goto(path)
      await expect(page.getByRole('banner')).toBeVisible()
    }
  })
})
