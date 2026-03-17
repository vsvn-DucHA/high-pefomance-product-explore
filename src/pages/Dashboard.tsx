import { useProducts } from '@/hooks/useProducts'
import { useProductFilters } from '@/hooks/useProductFilters'
import { ProductList } from '@/components/products/ProductList'
import { ProductSearch } from '@/components/products/ProductSearch'
import { ProductSort } from '@/components/products/ProductSort'
import { ProductFilters } from '@/components/products/ProductFilters'
import { LayoutGrid } from 'lucide-react'

export function Dashboard() {
  const {
    filters,
    setSearch,
    setCategories,
    setPriceRange,
    setMinRating,
    setSortBy,
    clearAll,
  } = useProductFilters()

  const { data: products = [], isLoading } = useProducts(filters)

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
          <ProductSearch value={filters.search ?? ''} onChange={setSearch} />
          <ProductSort value={filters.sortBy ?? 'name'} onChange={setSortBy} />
        </div>
      </div>

      {/* Body: Filters sidebar + Product list */}
      <div className='flex gap-8 items-start flex-1 min-h-0'>
        {/* Filters sidebar — sticky dưới toolbar */}
        <div className='hidden lg:block sticky top-34 self-start'>
          <ProductFilters
            categories={filters.categories ?? []}
            priceMin={filters.priceMin ?? 0}
            priceMax={filters.priceMax ?? 1000}
            minRating={filters.minRating ?? 0}
            onCategoriesChange={setCategories}
            onPriceRangeChange={setPriceRange}
            onMinRatingChange={setMinRating}
            onClearAll={clearAll}
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
