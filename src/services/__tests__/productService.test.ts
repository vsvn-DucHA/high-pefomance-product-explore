import { describe, it, expect } from 'vitest'
import { productService } from '../productService'
import type { Category } from '@/types/product'

// All tests run against the real 10k products.json — no mocks needed.

describe('productService.getAllProducts', () => {
  it('returns an array of products', () => {
    const products = productService.getAllProducts()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
  })
})

describe('productService.getProductById', () => {
  it('returns a product when id exists', () => {
    const allProducts = productService.getAllProducts()
    const first = allProducts[0]
    const found = productService.getProductById(first.id)
    expect(found).toBeDefined()
    expect(found?.id).toBe(first.id)
  })

  it('returns undefined when id does not exist', () => {
    const found = productService.getProductById('non-existent-id-xyz')
    expect(found).toBeUndefined()
  })
})

describe('productService.getPriceRange', () => {
  it('returns a valid min and max', () => {
    const { min, max } = productService.getPriceRange()
    expect(min).toBeGreaterThanOrEqual(0)
    expect(max).toBeGreaterThan(min)
  })
})

describe('productService.filterAndSort — search', () => {
  it('filters by product name (case-insensitive)', () => {
    const results = productService.filterAndSort({ search: 'a' })
    expect(results.length).toBeGreaterThan(0)
    results.forEach((p) => {
      const haystack =
        p.name.toLowerCase() +
        p.brand.toLowerCase() +
        p.description.toLowerCase()
      expect(haystack).toContain('a')
    })
  })

  it('returns empty array when no product matches search', () => {
    const results = productService.filterAndSort({
      search: 'zzz_no_match_xyz_123456',
    })
    expect(results).toHaveLength(0)
  })

  it('trims whitespace from search query', () => {
    const trimmed = productService.filterAndSort({ search: '  a  ' })
    const normal = productService.filterAndSort({ search: 'a' })
    expect(trimmed.length).toBe(normal.length)
  })
})

describe('productService.filterAndSort — categories', () => {
  const ALL_CATEGORIES: Category[] = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
  ]

  it('filters to a single category', () => {
    const results = productService.filterAndSort({
      categories: ['Electronics'],
    })
    expect(results.length).toBeGreaterThan(0)
    results.forEach((p) => expect(p.category).toBe('Electronics'))
  })

  it('filters to multiple categories', () => {
    const cats: Category[] = ['Electronics', 'Clothing']
    const results = productService.filterAndSort({ categories: cats })
    expect(results.length).toBeGreaterThan(0)
    results.forEach((p) =>
      expect(['Electronics', 'Clothing']).toContain(p.category),
    )
  })

  it('returns all products when categories is empty', () => {
    const all = productService.filterAndSort({ categories: [] })
    expect(all.length).toBe(productService.getAllProducts().length)
  })

  it('returns all products when filtering by all categories', () => {
    const all = productService.filterAndSort({ categories: ALL_CATEGORIES })
    expect(all.length).toBe(productService.getAllProducts().length)
  })
})

describe('productService.filterAndSort — price range', () => {
  it('filters products within price range', () => {
    const results = productService.filterAndSort({
      priceMin: 100,
      priceMax: 200,
    })
    expect(results.length).toBeGreaterThan(0)
    results.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(100)
      expect(p.price).toBeLessThanOrEqual(200)
    })
  })

  it('returns empty array when range is impossible (min > max)', () => {
    const results = productService.filterAndSort({
      priceMin: 900,
      priceMax: 100,
    })
    expect(results).toHaveLength(0)
  })

  it('applies exact boundary values inclusive', () => {
    // Find a real product price and filter exactly at that boundary
    const allProducts = productService.getAllProducts()
    const price = allProducts[0].price
    const results = productService.filterAndSort({
      priceMin: price,
      priceMax: price,
    })
    expect(results.length).toBeGreaterThanOrEqual(1)
    results.forEach((p) => expect(p.price).toBe(price))
  })
})

describe('productService.filterAndSort — minRating', () => {
  it('filters out products below minRating', () => {
    const results = productService.filterAndSort({ minRating: 4 })
    expect(results.length).toBeGreaterThan(0)
    results.forEach((p) => expect(p.rating).toBeGreaterThanOrEqual(4))
  })

  it('returns all products when minRating is 0', () => {
    const all = productService.filterAndSort({ minRating: 0 })
    expect(all.length).toBe(productService.getAllProducts().length)
  })

  it('returns empty when minRating is higher than any product rating', () => {
    const results = productService.filterAndSort({ minRating: 6 })
    expect(results).toHaveLength(0)
  })
})

describe('productService.filterAndSort — sorting', () => {
  it('sorts by name (alphabetical) by default', () => {
    const results = productService.filterAndSort({ sortBy: 'name' })
    for (let i = 1; i < Math.min(results.length, 100); i++) {
      expect(
        results[i - 1].name.localeCompare(results[i].name),
      ).toBeLessThanOrEqual(0)
    }
  })

  it('sorts by price_asc (cheapest first)', () => {
    const results = productService.filterAndSort({ sortBy: 'price_asc' })
    for (let i = 1; i < Math.min(results.length, 100); i++) {
      expect(results[i - 1].price).toBeLessThanOrEqual(results[i].price)
    }
  })

  it('sorts by price_desc (most expensive first)', () => {
    const results = productService.filterAndSort({ sortBy: 'price_desc' })
    for (let i = 1; i < Math.min(results.length, 100); i++) {
      expect(results[i - 1].price).toBeGreaterThanOrEqual(results[i].price)
    }
  })

  it('sorts by rating (highest first)', () => {
    const results = productService.filterAndSort({ sortBy: 'rating' })
    for (let i = 1; i < Math.min(results.length, 100); i++) {
      expect(results[i - 1].rating).toBeGreaterThanOrEqual(results[i].rating)
    }
  })
})

describe('productService.filterAndSort — combined filters', () => {
  it('applies search + category + minRating together', () => {
    const results = productService.filterAndSort({
      search: 'e',
      categories: ['Electronics'],
      minRating: 3,
      sortBy: 'price_asc',
    })
    results.forEach((p) => {
      expect(p.category).toBe('Electronics')
      expect(p.rating).toBeGreaterThanOrEqual(3)
      const haystack =
        p.name.toLowerCase() +
        p.brand.toLowerCase() +
        p.description.toLowerCase()
      expect(haystack).toContain('e')
    })
    // Verify sort
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].price).toBeLessThanOrEqual(results[i].price)
    }
  })
})
