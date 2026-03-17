import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductList } from '@/components/products/ProductList'
import { ProductSearch } from '@/components/products/ProductSearch'
import { ProductSort } from '@/components/products/ProductSort'
import { ProductFilters } from '@/components/products/ProductFilters'
import type { Category } from '@/types/product'
import type { FilterState, SortBy } from '@/types/filter'
import { LayoutGrid } from 'lucide-react'

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read URL state
  const search = searchParams.get('search') ?? ''
  const categories = searchParams.getAll('category') as Category[]
  const priceMin = Number(searchParams.get('priceMin') ?? 0)
  const priceMax = Number(searchParams.get('priceMax') ?? 1000)
  const minRating = Number(searchParams.get('minRating') ?? 0)
  const sortBy = (searchParams.get('sortBy') ?? 'name') as SortBy

  const filters: Partial<FilterState> = {
    search,
    categories,
    priceMin,
    priceMax,
    minRating,
    sortBy,
  }

  const { data: products = [], isLoading } = useProducts(filters)

  // URL update helpers
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

  const handleSearchChange = (value: string) => {
    updateParams({ search: value || null })
  }

  const handleCategoriesChange = (cats: Category[]) => {
    updateParams({ category: cats.length > 0 ? cats : null })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    updateParams({
      priceMin: min > 0 ? String(min) : null,
      priceMax: max < 1000 ? String(max) : null,
    })
  }

  const handleMinRatingChange = (rating: number) => {
    updateParams({ minRating: rating > 0 ? String(rating) : null })
  }

  const handleSortChange = (value: SortBy) => {
    updateParams({ sortBy: value !== 'name' ? value : null })
  }

  const handleClearAll = () => {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className='max-w-screen-2xl mx-auto px-4 flex-1 flex flex-col w-full bg-gray-50 min-h-0'>
      {/* Page header */}
      <div className='flex items-center gap-3 mb-6'>
        <LayoutGrid className='w-6 h-6 text-primary' aria-hidden='true' />
        <h1 className='text-2xl font-bold text-gray-900'>Dash board</h1>
      </div>

      {/* Toolbar: Search + Sort — sticky dưới header */}
      <div className='sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-3 mb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-gray-200'>
        <div className='flex flex-wrap items-center gap-3'>
          <ProductSearch value={search} onChange={handleSearchChange} />
          <ProductSort value={sortBy} onChange={handleSortChange} />
        </div>
      </div>

      {/* Body: Filters sidebar + Product list */}
      <div className='flex gap-8 items-start flex-1 min-h-0'>
        {/* Filters sidebar — sticky dưới toolbar */}
        <div className='hidden lg:block sticky top-34 self-start'>
          <ProductFilters
            categories={categories}
            priceMin={priceMin}
            priceMax={priceMax}
            minRating={minRating}
            onCategoriesChange={handleCategoriesChange}
            onPriceRangeChange={handlePriceRangeChange}
            onMinRatingChange={handleMinRatingChange}
            onClearAll={handleClearAll}
            totalResults={products.length}
          />
        </div>

        {/* Product grid (virtualized) */}
        <div className='flex-1 min-w-0 self-stretch min-h-0'>
          <ProductList products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
