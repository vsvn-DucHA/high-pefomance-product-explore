import { test, expect } from '@playwright/test'
import { loginAsTestUser, logoutUser } from './helpers/auth'

// Valid credentials per LoginForm Zod schema:
// username: 3–20 chars, letters/numbers/underscore
// password: 6+ chars, 1 uppercase, 1 number
const VALID_USER = { username: 'Testuser1', password: 'Password1' }

test.describe('Login page — rendering', () => {
  test.beforeEach(async ({ page }) => {
    await logoutUser(page)
    await page.goto('/login')
  })

  test('shows the login form', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible()
  })

  test('redirects to "/" when already authenticated', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/login')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Login page — validation', () => {
  test.beforeEach(async ({ page }) => {
    await logoutUser(page)
    await page.goto('/login')
  })

  test('shows username error when username is too short', async ({ page }) => {
    await page.locator('#username').fill('ab')
    await page.locator('#username').blur()
    await expect(
      page.getByText(/Username must be at least 3 characters/i),
    ).toBeVisible()
  })

  test('shows password error when password has no uppercase letter', async ({
    page,
  }) => {
    await page.locator('#password').fill('password1')
    await page.locator('#password').blur()
    await expect(
      page.getByText(/at least one uppercase letter/i),
    ).toBeVisible()
  })

  test('shows password error when password has no number', async ({ page }) => {
    await page.locator('#password').fill('Passwordonly')
    await page.locator('#password').blur()
    await expect(page.getByText(/at least one number/i)).toBeVisible()
  })

  test('shows password error when password is too short', async ({ page }) => {
    await page.locator('#password').fill('Ab1')
    await page.locator('#password').blur()
    await expect(
      page.getByText(/Password must be at least 6 characters/i),
    ).toBeVisible()
  })

  test('does not submit when form has validation errors', async ({ page }) => {
    await page.locator('#username').fill('ab')
    await page.locator('#password').fill('weak')
    await page.getByRole('button', { name: /Sign In/i }).click()

    // Should remain on /login
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Login page — successful login', () => {
  test.beforeEach(async ({ page }) => {
    await logoutUser(page)
    await page.goto('/login')
  })

  test('logs in with valid credentials and redirects to "/"', async ({
    page,
  }) => {
    await page.locator('#username').fill(VALID_USER.username)
    await page.locator('#password').fill(VALID_USER.password)
    await page.getByRole('button', { name: /Sign In/i }).click()

    // Button shows loading state during the 1500ms simulated API delay
    await expect(
      page.getByRole('button', { name: /Signing in/i }),
    ).toBeVisible()

    // After redirect, dashboard should be shown
    await expect(page).toHaveURL('/', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Dash board/i })).toBeVisible()
  })

  test('shows username in header after login', async ({ page }) => {
    await page.locator('#username').fill(VALID_USER.username)
    await page.locator('#password').fill(VALID_USER.password)
    await page.getByRole('button', { name: /Sign In/i }).click()

    await expect(page).toHaveURL('/', { timeout: 5000 })

    // Username should appear in header dropdown trigger
    await expect(
      page.getByText(VALID_USER.username, { exact: true }),
    ).toBeVisible()
  })

})

test.describe('Logout flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/')
    await page.getByRole('heading', { name: /Dash board/i }).waitFor()
  })

  test('opens dropdown and shows Sign Out option', async ({ page }) => {
    // Click the avatar/username trigger in the header
    await page.getByRole('button', { name: /testuser/i }).click()
    await expect(page.getByText('Sign Out')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await page.getByRole('button', { name: /testuser/i }).click()
    await page.getByText('Sign Out').click()

    await expect(page).toHaveURL(/\/login/, { timeout: 3000 })
  })

  test('cannot access protected route after logout', async ({ page }) => {
    await page.getByRole('button', { name: /testuser/i }).click()
    await page.getByText('Sign Out').click()

    await expect(page).toHaveURL(/\/login/, { timeout: 3000 })

    // Try navigating back to dashboard
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('clears username from header after logout', async ({ page }) => {
    await page.getByRole('button', { name: /testuser/i }).click()
    await page.getByText('Sign Out').click()

    await page.goto('/login')
    // Header no longer shows the username avatar button
    await expect(
      page.getByRole('button', { name: /testuser/i }),
    ).not.toBeVisible()
  })
})
