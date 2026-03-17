import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import type { FilterState } from '@/types/filter'

export function useProducts(filters: Partial<FilterState>) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.filterAndSort(filters),
    staleTime: Infinity, // in-memory data never goes stale
    placeholderData: (prev) => prev,
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) return null
      return productService.getProductById(id) ?? null
    },
    enabled: !!id,
    staleTime: Infinity,
  })
}
