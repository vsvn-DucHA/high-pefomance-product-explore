import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthState, LoginCredentials, User } from '@/types/auth'
import { authService } from '@/services/authService'

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    authService.getStoredUser(),
  )

  const login = useCallback((credentials: LoginCredentials) => {
    const loggedInUser = authService.login(credentials)
    setUser(loggedInUser)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
