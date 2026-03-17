import type { Product, Category } from '@/types/product'
import type { FilterState } from '@/types/filter'

// Import products data - loaded once
import productsData from '@/data/products.json'

const products = productsData as Product[]

export const productService = {
  getAllProducts(): Product[] {
    return products
  },

  getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id)
  },

  filterAndSort(filters: Partial<FilterState>): Product[] {
    const {
      search = '',
      categories = [],
      priceMin = 0,
      priceMax = 1000,
      minRating = 0,
      sortBy = 'name',
    } = filters

    let result = products

    // Filter by search (name, brand, description)
    if (search.trim()) {
      const query = search.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      )
    }

    // Filter by categories (multi-select)
    if (categories.length > 0) {
      const catSet = new Set<Category>(categories as Category[])
      result = result.filter((p) => catSet.has(p.category))
    }

    // Filter by price range
    result = result.filter((p) => p.price >= priceMin && p.price <= priceMax)

    // Filter by minimum rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return result
  },

  getPriceRange(): { min: number; max: number } {
    let min = Infinity
    let max = -Infinity
    for (const p of products) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    return { min: Math.floor(min), max: Math.ceil(max) }
  },
}
