import type { LoginCredentials, User } from '@/types/auth'

const AUTH_STORAGE_KEY = 'app_auth_user'

export const authService = {
  login(credentials: LoginCredentials): User {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required')
    }

    const user: User = {
      id: `user_${credentials.username}`,
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      token: btoa(`${credentials.username}:${Date.now()}`),
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  },
}
