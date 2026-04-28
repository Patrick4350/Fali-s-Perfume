import { test, expect } from '@playwright/test'

test.describe('Checkout', () => {
  test('shows empty cart state when no items', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByText(/your cart is empty|nothing in your cart|no items/i)).toBeVisible()
  })

  test('cart drawer opens from header', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(/open cart/i).click()
    await expect(page.getByText(/your cart/i)).toBeVisible()
  })
})
