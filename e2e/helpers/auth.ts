import type { Page } from '@playwright/test'

const AUTH_STORAGE_KEY = 'app_auth_user'

/**
 * Injects a valid auth user into localStorage to bypass the login page.
 * Must be called after at least one page.goto() so the page context exists.
 */
export async function loginAsTestUser(page: Page): Promise<void> {
  // First navigate to the origin so localStorage is accessible
  await page.goto('/')

  await page.evaluate((key) => {
    const user = {
      id: 'user_testuser',
      username: 'testuser',
      email: 'testuser@example.com',
      token: btoa('testuser:' + String(Date.now())),
    }
    localStorage.setItem(key, JSON.stringify(user))
  }, AUTH_STORAGE_KEY)
}

export async function logoutUser(page: Page): Promise<void> {
  // Must navigate to origin first so localStorage is accessible
  // (calling evaluate on about:blank throws SecurityError)
  await page.goto('/')
  await page.evaluate((key) => {
    localStorage.removeItem(key)
  }, AUTH_STORAGE_KEY)
}
