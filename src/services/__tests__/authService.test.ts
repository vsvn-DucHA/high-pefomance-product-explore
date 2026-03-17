import { describe, it, expect, afterEach } from 'vitest'
import { authService } from '../authService'

const AUTH_STORAGE_KEY = 'app_auth_user'

describe('authService.login', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns a user object with correct fields', () => {
    const user = authService.login({ username: 'alice', password: 'secret' })

    expect(user.id).toBe('user_alice')
    expect(user.username).toBe('alice')
    expect(user.email).toBe('alice@example.com')
    expect(typeof user.token).toBe('string')
    expect(user.token.length).toBeGreaterThan(0)
  })

  it('persists user to localStorage', () => {
    authService.login({ username: 'alice', password: 'secret' })

    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.username).toBe('alice')
  })

  it('throws when username is empty', () => {
    expect(() =>
      authService.login({ username: '', password: 'secret' }),
    ).toThrow('Username and password are required')
  })

  it('throws when password is empty', () => {
    expect(() =>
      authService.login({ username: 'alice', password: '' }),
    ).toThrow('Username and password are required')
  })

  it('overwrites previous stored user on second login', () => {
    authService.login({ username: 'alice', password: 'a' })
    authService.login({ username: 'bob', password: 'b' })

    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)!)
    expect(stored.username).toBe('bob')
  })
})

describe('authService.logout', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('removes user from localStorage', () => {
    authService.login({ username: 'alice', password: 'secret' })
    authService.logout()

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('is safe to call when not logged in', () => {
    expect(() => authService.logout()).not.toThrow()
  })
})

describe('authService.getStoredUser', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is stored', () => {
    expect(authService.getStoredUser()).toBeNull()
  })

  it('returns the stored user after login', () => {
    authService.login({ username: 'alice', password: 'secret' })
    const user = authService.getStoredUser()

    expect(user).not.toBeNull()
    expect(user?.username).toBe('alice')
  })

  it('returns null after logout', () => {
    authService.login({ username: 'alice', password: 'secret' })
    authService.logout()

    expect(authService.getStoredUser()).toBeNull()
  })

  it('returns null when localStorage contains invalid JSON', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'not-valid-json{{{')
    expect(authService.getStoredUser()).toBeNull()
  })
})
