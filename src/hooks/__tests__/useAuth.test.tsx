import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '../useAuth'
import { authService } from '@/services/authService'

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

describe('useAuth', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('throws when used outside AuthProvider', () => {
    // Suppress React error boundary output in test
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })

  it('returns isAuthenticated: false when not logged in', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('returns isAuthenticated: true after login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper })

    act(() => {
      result.current.login({ username: 'testuser', password: 'pass' })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.username).toBe('testuser')
  })

  it('returns isAuthenticated: false after logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper })

    act(() => {
      result.current.login({ username: 'testuser', password: 'pass' })
    })
    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('restores persisted user from localStorage on mount', () => {
    // Pre-store a user before the hook mounts
    authService.login({ username: 'persisted', password: 'x' })

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.username).toBe('persisted')
  })
})
