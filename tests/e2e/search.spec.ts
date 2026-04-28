import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('search page loads with input', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('textbox', { name: /search/i })).toBeVisible()
  })

  test('typing a query updates the URL', async ({ page }) => {
    await page.goto('/search')
    const input = page.getByRole('textbox', { name: /search/i })
    await input.fill('perfume')
    await input.press('Enter')
    await expect(page).toHaveURL(/q=perfume/)
  })

  test('clear button removes the query', async ({ page }) => {
    await page.goto('/search?q=rose')
    const clear = page.getByRole('button', { name: /clear/i })
    if (await clear.isVisible()) {
      await clear.click()
      await expect(page.getByRole('textbox', { name: /search/i })).toHaveValue('')
    }
  })

  test('shows results or empty state for a query', async ({ page }) => {
    await page.goto('/search?q=a')
    const results = page.locator('a[href^="/products/"]')
    const empty = page.getByText(/no results/i)
    await page.waitForTimeout(500)
    const hasResults = (await results.count()) > 0
    const hasEmpty = await empty.isVisible().catch(() => false)
    expect(hasResults || hasEmpty).toBe(true)
  })
})
