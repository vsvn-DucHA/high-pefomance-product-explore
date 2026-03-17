import { useRef, useMemo, useState, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Product } from '@/types/product'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { PackageSearch } from 'lucide-react'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
}

const CARD_HEIGHT = 324 // 256px image + 16px gap + 20px title + 12px price + 16px rating + padding
const GAP = 24 // grid gap, must match the CSS gap in the grid container

const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
} as const

function getColumns(): 1 | 2 | 3 | 4 {
  if (typeof window === 'undefined') return 3
  const w = window.innerWidth
  if (w < 640) return 1
  if (w < 1024) return 2
  if (w < 1280) return 3
  return 4
}

function useColumns(): 1 | 2 | 3 | 4 {
  'use no memo'
  const [columns, setColumns] = useState(getColumns)
  useEffect(() => {
    const onResize = () => setColumns(getColumns())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return columns
}

export function ProductList({ products, isLoading }: ProductListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const columns = useColumns()

  const rows = useMemo(() => {
    const result: Product[][] = []
    for (let i = 0; i < products.length; i += columns) {
      result.push(products.slice(i, i + columns))
    }
    return result
  }, [products, columns])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 5,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (el) => el.getBoundingClientRect().height
        : undefined,
  })

  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${GRID_COLS[columns]}`}
        aria-label='Loading products'
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className='space-y-3'>
            <Skeleton className='w-full aspect-4/3 rounded-lg' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
            <Skeleton className='h-5 w-1/3' />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <PackageSearch
          className='w-16 h-16 text-gray-300 mb-4'
          aria-hidden='true'
        />
        <h3 className='text-lg font-semibold text-gray-700 mb-1'>
          No products found
        </h3>
        <p className='text-gray-400 text-sm max-w-xs'>
          Try adjusting your filters or search term to find what you're looking
          for.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      role='list'
      aria-label={`${products.length} products`}
      className='overflow-y-auto h-full'
    >
      {/* Total height container for virtual scroll */}
      <div
        className='relative w-full'
        style={{ height: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className='absolute top-0 left-0 w-full'
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className={`grid gap-6 pb-6 ${GRID_COLS[columns]}`}>
                {row.map((product) => (
                  <div key={product.id} role='listitem'>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
