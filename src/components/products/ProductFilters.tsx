import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, type Category } from '@/types/product'

interface ProductFiltersProps {
  categories: Category[]
  priceMin: number
  priceMax: number
  minRating: number
  onCategoriesChange: (categories: Category[]) => void
  onPriceRangeChange: (min: number, max: number) => void
  onMinRatingChange: (rating: number) => void
  onClearAll: () => void
  totalResults: number
}

const MAX_PRICE = 1000

export function ProductFilters({
  categories,
  priceMin,
  priceMax,
  minRating,
  onCategoriesChange,
  onPriceRangeChange,
  onMinRatingChange,
  onClearAll,
  totalResults,
}: ProductFiltersProps) {
  const hasActiveFilters =
    categories.length > 0 ||
    priceMin > 0 ||
    priceMax < MAX_PRICE ||
    minRating > 0

  const toggleCategory = (cat: Category) => {
    if (categories.includes(cat)) {
      onCategoriesChange(categories.filter((c) => c !== cat))
    } else {
      onCategoriesChange([...categories, cat])
    }
  }

  return (
    <aside className='w-64 shrink-0 space-y-5' aria-label='Product filters'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SlidersHorizontal
            className='w-4 h-4 text-gray-600'
            aria-hidden='true'
          />
          <h2 className='font-semibold text-gray-900'>Filters</h2>
          {hasActiveFilters && (
            <Badge variant='secondary' className='text-xs'>
              Active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onClearAll}
            className='text-xs h-7 px-2 text-gray-500 hover:text-gray-900'
          >
            <X className='w-3 h-3 mr-1' />
            Clear
          </Button>
        )}
      </div>

      <p className='text-xs text-gray-500'>
        {totalResults.toLocaleString()} products found
      </p>

      <Separator />

      {/* Categories */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-gray-700'>Category</h3>
        <ul className='space-y-2' role='group' aria-label='Filter by category'>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label className='flex items-center gap-2.5 cursor-pointer group'>
                <Checkbox
                  checked={categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  aria-label={cat}
                  id={`cat-${cat}`}
                />
                <span className='text-sm text-gray-600 group-hover:text-gray-900 transition-colors'>
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Price Range */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-700'>Price Range</h3>
          <span className='text-xs text-gray-500'>
            ${priceMin} – ${priceMax}
          </span>
        </div>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={10}
          value={[priceMin, priceMax]}
          onValueChange={(v) => {
            const arr = Array.isArray(v) ? v : [v, v]
            onPriceRangeChange(arr[0] ?? priceMin, arr[1] ?? priceMax)
          }}
          className='mt-2'
          aria-label='Price range'
        />
        <div className='flex justify-between text-xs text-gray-400'>
          <span>$0</span>
          <span>${MAX_PRICE}</span>
        </div>
      </div>

      <Separator />

      {/* Minimum Rating */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-gray-700'>Minimum Rating</h3>
        <div
          className='flex gap-1.5'
          role='group'
          aria-label='Filter by rating'
        >
          {[0, 1, 2, 3, 4].map((r) => (
            <button
              key={r}
              type='button'
              onClick={() => onMinRatingChange(r === minRating ? 0 : r)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                minRating === r && r > 0
                  ? 'bg-amber-50 border-amber-400 text-amber-700'
                  : r === 0
                    ? minRating === 0
                      ? 'bg-gray-100 border-gray-300 text-gray-700'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    : 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
              }`}
              aria-pressed={minRating === r}
              aria-label={r === 0 ? 'Any rating' : `${r}+ stars`}
            >
              {r === 0 ? (
                <span>Any</span>
              ) : (
                <>
                  <Star className='w-3 h-3 fill-current' aria-hidden='true' />
                  <span>{r}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
