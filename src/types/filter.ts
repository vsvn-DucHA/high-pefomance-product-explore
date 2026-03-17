import type { Category } from './product'

export type SortBy = 'price_asc' | 'price_desc' | 'rating' | 'name'

export interface FilterState {
  search: string
  categories: Category[]
  priceMin: number
  priceMax: number
  minRating: number
  sortBy: SortBy
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  categories: [],
  priceMin: 0,
  priceMax: 1000,
  minRating: 0,
  sortBy: 'name',
}
