import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import type { Category } from '@/types/product'
import type { FilterState, SortBy } from '@/types/filter'

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse current filters from URL
  const filters: Partial<FilterState> = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      categories: searchParams.getAll('category') as Category[],
      priceMin: Number(searchParams.get('priceMin') ?? 0),
      priceMax: Number(searchParams.get('priceMax') ?? 1000),
      minRating: Number(searchParams.get('minRating') ?? 0),
      sortBy: (searchParams.get('sortBy') ?? 'name') as SortBy,
    }),
    [searchParams],
  )

  // Generic URL update helper
  const updateParams = (updates: Record<string, string | string[] | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (
            value === null ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
          ) {
            next.delete(key)
          } else if (Array.isArray(value)) {
            next.delete(key)
            value.forEach((v) => next.append(key, v))
          } else {
            next.set(key, value)
          }
        }
        return next
      },
      { replace: true },
    )
  }

  // Typed filter update handlers
  const handlers = useMemo(
    () => ({
      setSearch: (value: string) => {
        updateParams({ search: value || null })
      },

      setCategories: (cats: Category[]) => {
        updateParams({ category: cats.length > 0 ? cats : null })
      },

      setPriceRange: (min: number, max: number) => {
        updateParams({
          priceMin: min > 0 ? String(min) : null,
          priceMax: max < 1000 ? String(max) : null,
        })
      },

      setMinRating: (rating: number) => {
        updateParams({ minRating: rating > 0 ? String(rating) : null })
      },

      setSortBy: (value: SortBy) => {
        updateParams({ sortBy: value !== 'name' ? value : null })
      },

      clearAll: () => {
        setSearchParams({}, { replace: true })
      },
    }),
    // updateParams uses setSearchParams which is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return {
    filters,
    ...handlers,
  }
}
