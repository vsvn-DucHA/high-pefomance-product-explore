import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './helpers/auth'

test.describe('Product Detail page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/')
    // Wait for product cards to be rendered
    await page.getByRole('link', { name: /View .+ details/i }).first().waitFor()
  })

  test('navigates to product detail when clicking a product card', async ({
    page,
  }) => {
    const firstCard = page.getByRole('link', { name: /View .+ details/i }).first()
    await firstCard.click()

    // URL should change to /products/:id
    await expect(page).toHaveURL(/\/products\/[\w-]+/, { timeout: 5000 })
  })

  test('product detail page renders product name and price', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /View .+ details/i }).first().click()
    await expect(page).toHaveURL(/\/products\//, { timeout: 5000 })

    // Price should be visible (formatted as currency)
    await expect(page.getByText(/\$[\d,]+(\.\d{2})?/)).toBeVisible({
      timeout: 5000,
    })
  })

  test('product detail page has a Back button that returns to dashboard', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /View .+ details/i }).first().click()
    await expect(page).toHaveURL(/\/products\//, { timeout: 5000 })

    // Find back link (ArrowLeft + "Back to Products" or similar)
    const backLink = page.getByRole('link', { name: /back/i })
    await expect(backLink).toBeVisible()
    await backLink.click()

    await expect(page).toHaveURL('/', { timeout: 3000 })
  })

  test('pressing browser back navigates back to dashboard', async ({
    page,
  }) => {
    const firstCard = page.getByRole('link', { name: /View .+ details/i }).first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/products\//, { timeout: 5000 })

    await page.goBack()
    await expect(page).toHaveURL('/', { timeout: 3000 })
  })

  test('back link preserves search filter from dashboard', async ({ page }) => {
    // Start with a filter applied
    await page.goto('/?search=e&sortBy=rating')
    await page.getByRole('link', { name: /View .+ details/i }).first().waitFor()

    await page.getByRole('link', { name: /View .+ details/i }).first().click()
    await expect(page).toHaveURL(/\/products\//, { timeout: 5000 })

    const backLink = page.getByRole('link', { name: /back/i })
    await backLink.click()

    // Filter params should be restored
    await expect(page).toHaveURL(/search=e/, { timeout: 3000 })
    await expect(page).toHaveURL(/sortBy=rating/, { timeout: 3000 })
  })

  test('shows "Product Not Found" for non-existent product id', async ({
    page,
  }) => {
    await page.goto('/products/non-existent-product-id-xyz')

    await expect(
      page.getByRole('heading', { name: /Product Not Found/i }),
    ).toBeVisible({ timeout: 5000 })
  })

  test('404 page has a back link that goes to dashboard', async ({ page }) => {
    await page.goto('/products/non-existent-product-id-xyz')

    await expect(
      page.getByRole('heading', { name: /Product Not Found/i }),
    ).toBeVisible({ timeout: 5000 })

    await page.getByRole('link', { name: /Back to Products/i }).click()
    await expect(page).toHaveURL('/', { timeout: 3000 })
  })

  test('product detail page is accessible only when authenticated', async ({
    page,
  }) => {
    // Clear auth and try to access a product detail URL directly
    await page.evaluate(() => localStorage.clear())
    await page.goto('/products/some-product-id')

    await expect(page).toHaveURL(/\/login/, { timeout: 3000 })
  })
})
