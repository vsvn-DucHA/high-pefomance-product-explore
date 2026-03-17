import { test, expect } from '@playwright/test'
import { loginAsTestUser, logoutUser } from './helpers/auth'

test.describe('Dashboard — product listing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/')
    // Wait for the product list to be visible
    await page.waitForSelector('main, [role="main"], h1', { timeout: 10_000 })
  })

  test('redirects unauthenticated users to /login', async ({ page }) => {
    await logoutUser(page)
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('loads dashboard and renders product cards', async ({ page }) => {
    // At least one product link should be visible
    const cards = page.getByRole('link', { name: /View .+ details/i })
    await expect(cards.first()).toBeVisible({ timeout: 10_000 })
  })

  test('renders heading "Dash board"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Dash board/i })).toBeVisible()
  })
})

test.describe('Dashboard — search filter', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/')
    await page.getByRole('link', { name: /View .+ details/i }).first().waitFor()
  })

  test('typing in search updates the URL with ?search= param', async ({
    page,
  }) => {
    await page.getByLabel('Search products').fill('laptop')
    // Wait for debounce (400ms) + URL update
    await expect(page).toHaveURL(/search=laptop/, { timeout: 3500 })
  })

  test('search filters the visible product list', async ({ page }) => {
    const searchTerm = 'a'
    await page.getByLabel('Search products').fill(searchTerm)
    await expect(page).toHaveURL(new RegExp(`search=${searchTerm}`), {
      timeout: 3500,
    })

    // Verify at least one card is still shown (broad search term)
    await expect(
      page.getByRole('link', { name: /View .+ details/i }).first(),
    ).toBeVisible({ timeout: 3000 })
  })

  test('clearing search restores full product list', async ({ page }) => {
    const searchInput = page.getByLabel('Search products')

    await searchInput.fill('laptop')
    await expect(page).toHaveURL(/search=laptop/, { timeout: 3500 })

    await searchInput.clear()
    // URL should no longer have search param after debounce
    await expect(page).not.toHaveURL(/search=/, { timeout: 3500 })
  })

  test('navigating directly to URL with search param applies the filter', async ({
    page,
  }) => {
    await page.goto('/?search=book')
    await expect(page.getByLabel('Search products')).toHaveValue('book', {
      timeout: 3000,
    })
  })
})

test.describe('Dashboard — sort filter', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/')
    await page.getByRole('link', { name: /View .+ details/i }).first().waitFor()
  })

  test('changing sort updates URL with ?sortBy= param', async ({ page }) => {
    // Open the sort dropdown
    await page.getByLabel('Sort products').click()
    // Click "Price: Low to High" option
    await page.getByText('Price: Low to High').click()
    await expect(page).toHaveURL(/sortBy=price_asc/, { timeout: 3500 })
  })

  test('navigating to URL with sortBy param selects the correct option', async ({
    page,
  }) => {
    await page.goto('/?sortBy=rating')
    await expect(page.getByLabel('Sort products')).toContainText('Top Rated', {
      timeout: 3000,
    })
  })

  test('selecting default sort (Name A-Z) removes sortBy from URL', async ({
    page,
  }) => {
    await page.goto('/?sortBy=rating')

    await page.getByLabel('Sort products').click()
    await page.getByText('Name (A-Z)').click()

    await expect(page).not.toHaveURL(/sortBy=/, { timeout: 3500 })
  })
})

test.describe('Dashboard — URL shareability', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('shared URL with multiple params restores full filter state', async ({
    page,
  }) => {
    await page.goto('/?search=e&sortBy=rating&minRating=3')

    // Search input should reflect the URL
    await expect(page.getByLabel('Search products')).toHaveValue('e', {
      timeout: 5000,
    })
    // Sort should reflect the URL
    await expect(page.getByLabel('Sort products')).toContainText('Top Rated')
    // Products should be visible
    await expect(
      page.getByRole('link', { name: /View .+ details/i }).first(),
    ).toBeVisible({ timeout: 5000 })
  })

  test('browser back button restores previous filter state', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /View .+ details/i }).first().waitFor()

    await page.getByLabel('Search products').fill('phone')
    await expect(page).toHaveURL(/search=phone/, { timeout: 3500 })

    // Navigate forward then go back
    await page.goBack()

    // After going back, search should be cleared
    await expect(page).not.toHaveURL(/search=phone/, { timeout: 3500 })
  })
})
