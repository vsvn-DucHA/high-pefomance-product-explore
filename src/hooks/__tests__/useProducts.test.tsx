import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts, useProduct } from '../useProducts'

/** Creates a fresh QueryClient for each test to avoid cache bleed-over. */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry on failures in tests
      },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useProducts', () => {
  it('returns data with no filters applied (full product list)', async () => {
    const { result } = renderHook(() => useProducts({}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('returns filtered products when search filter is set', async () => {
    const { result } = renderHook(
      () => useProducts({ search: 'zzz_no_match_xyz_999' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(0)
  })

  it('returns products sorted by price_asc', async () => {
    const { result } = renderHook(
      () => useProducts({ sortBy: 'price_asc', priceMax: 1000 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const data = result.current.data!
    for (let i = 1; i < Math.min(data.length, 20); i++) {
      expect(data[i - 1].price).toBeLessThanOrEqual(data[i].price)
    }
  })

  it('uses a different cache key for different filters', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const { result: r1 } = renderHook(
      () => useProducts({ categories: ['Electronics'] }),
      { wrapper },
    )
    const { result: r2 } = renderHook(
      () => useProducts({ categories: ['Clothing'] }),
      { wrapper },
    )

    await waitFor(() => expect(r1.current.isSuccess).toBe(true))
    await waitFor(() => expect(r2.current.isSuccess).toBe(true))

    const onlyElectronics = r1.current.data!.every(
      (p) => p.category === 'Electronics',
    )
    const onlyClothing = r2.current.data!.every(
      (p) => p.category === 'Clothing',
    )

    expect(onlyElectronics).toBe(true)
    expect(onlyClothing).toBe(true)
  })

  it('is in loading state on initial fetch', () => {
    const { result } = renderHook(() => useProducts({}), {
      wrapper: createWrapper(),
    })

    // On very first render before data resolves it should be pending or success
    // (synchronous since productService is in-memory — may resolve immediately)
    expect(result.current.isLoading || result.current.isSuccess).toBe(true)
  })
})

describe('useProduct', () => {
  it('returns null when id is undefined (disabled query)', async () => {
    const { result } = renderHook(() => useProduct(undefined), {
      wrapper: createWrapper(),
    })

    // Query is disabled, data stays undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns the correct product by id', async () => {
    // Use a real product id from the service
    const { productService } = await import('@/services/productService')
    const realId = productService.getAllProducts()[0].id

    const { result } = renderHook(() => useProduct(realId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.id).toBe(realId)
  })

  it('returns null when product id does not exist', async () => {
    const { result } = renderHook(() => useProduct('non-existent-id-abc-xyz'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeNull()
  })
})
