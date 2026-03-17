import { Link, useLocation } from 'react-router-dom'
import { Star, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const location = useLocation()
  const stockStatus =
    product.stock === 0
      ? 'out-of-stock'
      : product.stock < 10
        ? 'low-stock'
        : 'in-stock'

  const stockLabel =
    stockStatus === 'out-of-stock'
      ? 'Out of Stock'
      : stockStatus === 'low-stock'
        ? `Only ${product.stock} left`
        : 'In Stock'

  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: location.pathname + location.search }}
      className='block w-full max-w-sm mx-auto h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg'
      aria-label={`View ${product.name} details`}
    >
      <Card className='h-full max-h-72 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group overflow-hidden'>
        <div className='relative overflow-hidden bg-gray-100 aspect-4/3'>
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
            decoding='async'
          />
          <Badge variant='secondary' className='absolute top-2 left-2 text-xs'>
            {product.category}
          </Badge>
          {stockStatus === 'out-of-stock' && (
            <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
              <span className='text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <CardContent className='p-4 flex flex-col gap-2'>
          {/* Title area — min-h cố định để tất cả card bằng chiều cao nhau */}
          <div className='min-h-14'>
            <p className='text-xs text-gray-500 mb-0.5'>{product.brand}</p>
            <h3 className='font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors'>
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className='flex items-center gap-1'>
            <Star
              className='w-3.5 h-3.5 fill-amber-400 text-amber-400'
              aria-hidden='true'
            />
            <span className='text-sm font-medium text-gray-700'>
              {product.rating.toFixed(1)}
            </span>
            <span className='text-xs text-gray-400'>
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price + Stock — đẩy xuống bottom */}
          <div className='flex items-center justify-between mt-auto pt-1'>
            <span className='text-lg font-bold text-gray-900'>
              ${product.price.toFixed(2)}
            </span>
            <div className='flex items-center gap-1'>
              <Package className='w-3 h-3' aria-hidden='true' />
              <span
                className={`text-xs font-medium ${
                  stockStatus === 'out-of-stock'
                    ? 'text-red-500'
                    : stockStatus === 'low-stock'
                      ? 'text-amber-600'
                      : 'text-green-600'
                }`}
              >
                {stockLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
