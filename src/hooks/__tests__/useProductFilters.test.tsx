import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useProductFilters } from '../useProductFilters'
import type { Category } from '@/types/product'
import type { SortBy } from '@/types/filter'

/** Wraps the hook in a MemoryRouter with an optional initial URL. */
function createWrapper(initialUrl = '/') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
  }
}

describe('useProductFilters — default state', () => {
  it('returns default filter values when URL is empty', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    expect(result.current.filters.search).toBe('')
    expect(result.current.filters.sortBy).toBe('name')
    expect(result.current.filters.priceMin).toBe(0)
    expect(result.current.filters.priceMax).toBe(1000)
    expect(result.current.filters.categories).toEqual([])
    expect(result.current.filters.minRating).toBe(0)
  })

  it('parses search + sortBy + minRating from URL on mount', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?search=tv&sortBy=rating&minRating=3'),
    })

    expect(result.current.filters.search).toBe('tv')
    expect(result.current.filters.sortBy).toBe('rating')
    expect(result.current.filters.minRating).toBe(3)
  })

  it('parses multiple category params from URL', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?category=Electronics&category=Clothing'),
    })

    expect(result.current.filters.categories).toEqual([
      'Electronics',
      'Clothing',
    ])
  })

  it('parses price range from URL', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?priceMin=100&priceMax=500'),
    })

    expect(result.current.filters.priceMin).toBe(100)
    expect(result.current.filters.priceMax).toBe(500)
  })
})

describe('useProductFilters — setSearch', () => {
  it('updates search filter', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setSearch('laptop')
    })

    expect(result.current.filters.search).toBe('laptop')
  })

  it('clears search when set to empty string', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?search=laptop'),
    })

    act(() => {
      result.current.setSearch('')
    })

    expect(result.current.filters.search).toBe('')
  })

  it('preserves other filters when updating search', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?sortBy=rating&minRating=3'),
    })

    act(() => {
      result.current.setSearch('phone')
    })

    expect(result.current.filters.search).toBe('phone')
    expect(result.current.filters.sortBy).toBe('rating')
    expect(result.current.filters.minRating).toBe(3)
  })
})

describe('useProductFilters — setSortBy', () => {
  it('sets sortBy to a non-default value', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setSortBy('price_asc')
    })

    expect(result.current.filters.sortBy).toBe('price_asc')
  })

  it('reverts to default "name" when sortBy is set to "name"', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?sortBy=rating'),
    })

    act(() => {
      result.current.setSortBy('name' as SortBy)
    })

    expect(result.current.filters.sortBy).toBe('name')
  })

  it('cycles through all sort options', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })
    const sortOptions: SortBy[] = ['price_asc', 'price_desc', 'rating', 'name']

    for (const option of sortOptions) {
      act(() => {
        result.current.setSortBy(option)
      })
      expect(result.current.filters.sortBy).toBe(option)
    }
  })
})

describe('useProductFilters — setCategories', () => {
  it('sets a single category', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setCategories(['Electronics'] as Category[])
    })

    expect(result.current.filters.categories).toEqual(['Electronics'])
  })

  it('sets multiple categories', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setCategories(['Electronics', 'Clothing'] as Category[])
    })

    expect(result.current.filters.categories).toEqual([
      'Electronics',
      'Clothing',
    ])
  })

  it('clears categories when set to empty array', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?category=Electronics'),
    })

    act(() => {
      result.current.setCategories([])
    })

    expect(result.current.filters.categories).toEqual([])
  })
})

describe('useProductFilters — setPriceRange', () => {
  it('sets both priceMin and priceMax', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setPriceRange(100, 500)
    })

    expect(result.current.filters.priceMin).toBe(100)
    expect(result.current.filters.priceMax).toBe(500)
  })

  it('resets to defaults when called with (0, 1000)', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?priceMin=100&priceMax=500'),
    })

    act(() => {
      result.current.setPriceRange(0, 1000)
    })

    expect(result.current.filters.priceMin).toBe(0)
    expect(result.current.filters.priceMax).toBe(1000)
  })
})

describe('useProductFilters — setMinRating', () => {
  it('sets minRating', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setMinRating(4)
    })

    expect(result.current.filters.minRating).toBe(4)
  })

  it('clears minRating when set to 0', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper('/?minRating=4'),
    })

    act(() => {
      result.current.setMinRating(0)
    })

    expect(result.current.filters.minRating).toBe(0)
  })
})

describe('useProductFilters — clearAll', () => {
  it('resets all filters to default values', () => {
    const { result } = renderHook(() => useProductFilters(), {
      wrapper: createWrapper(
        '/?search=tv&sortBy=rating&category=Electronics&minRating=3&priceMin=100&priceMax=500',
      ),
    })

    act(() => {
      result.current.clearAll()
    })

    expect(result.current.filters.search).toBe('')
    expect(result.current.filters.sortBy).toBe('name')
    expect(result.current.filters.categories).toEqual([])
    expect(result.current.filters.minRating).toBe(0)
    expect(result.current.filters.priceMin).toBe(0)
    expect(result.current.filters.priceMax).toBe(1000)
  })
})
