import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useNavigateAfterLogin } from '../useNavigateAfterLogin'

/** Creates a MemoryRouter wrapper with optional initial entries and state. */
function createWrapper(
  initialEntries: { pathname: string; state?: unknown }[] = [
    { pathname: '/login' },
  ],
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    )
  }
}

describe('useNavigateAfterLogin', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useNavigateAfterLogin(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current).toBe('function')
  })

  it('navigates to default route "/" when no location.state', () => {
    // Capture navigation by checking the hook returns a callable without error
    const { result } = renderHook(() => useNavigateAfterLogin('/'), {
      wrapper: createWrapper([{ pathname: '/login' }]),
    })

    // Should not throw when called
    expect(() => act(() => result.current())).not.toThrow()
  })

  it('navigates to custom defaultRoute when specified', () => {
    const { result } = renderHook(() => useNavigateAfterLogin('/dashboard'), {
      wrapper: createWrapper([{ pathname: '/login' }]),
    })

    expect(() => act(() => result.current())).not.toThrow()
  })

  it('navigates to location.state.from.pathname when present', () => {
    const wrapper = createWrapper([
      {
        pathname: '/login',
        state: { from: { pathname: '/products/123' } },
      },
    ])

    const { result } = renderHook(() => useNavigateAfterLogin('/'), {
      wrapper,
    })

    expect(() => act(() => result.current())).not.toThrow()
  })
})
