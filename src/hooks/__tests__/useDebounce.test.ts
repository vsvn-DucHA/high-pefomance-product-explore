import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('does not update value before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } },
    )

    rerender({ value: 'updated' })

    // Advance only half the delay
    act(() => {
      vi.advanceTimersByTime(250)
    })

    // Should still return the old value
    expect(result.current).toBe('initial')
  })

  it('updates value after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } },
    )

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('resets the timer on rapid successive changes (debounce behavior)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } },
    )

    rerender({ value: 'b' })
    act(() => { vi.advanceTimersByTime(200) })

    rerender({ value: 'c' })
    act(() => { vi.advanceTimersByTime(200) })

    rerender({ value: 'final' })
    // Timer still not complete (200ms since last change)
    expect(result.current).toBe('a')

    // Now let the full delay pass from last rerender
    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current).toBe('final')
  })

  it('uses default delay of 500ms when no delay specified', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'start' } },
    )

    rerender({ value: 'end' })

    act(() => { vi.advanceTimersByTime(499) })
    expect(result.current).toBe('start')

    act(() => { vi.advanceTimersByTime(1) })
    expect(result.current).toBe('end')
  })

  it('works with non-string types (number)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } },
    )

    rerender({ value: 42 })

    act(() => { vi.advanceTimersByTime(300) })

    expect(result.current).toBe(42)
  })

  it('clears pending timer when delay prop changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    )

    rerender({ value: 'b', delay: 500 })

    // Change the delay mid-flight — resets the timer
    rerender({ value: 'b', delay: 100 })

    act(() => { vi.advanceTimersByTime(100) })

    expect(result.current).toBe('b')
  })
})
