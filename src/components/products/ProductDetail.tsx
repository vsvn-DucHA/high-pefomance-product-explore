import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Star, Package, Tag, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Product } from '@/types/product'

interface ProductDetailViewProps {
  product: Product
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { state } = useLocation()
  const backTo = (state as { from?: string } | null)?.from ?? '/'

  const stockStatus =
    product.stock === 0
      ? 'out-of-stock'
      : product.stock < 10
        ? 'low-stock'
        : 'in-stock'

  const stockColor =
    stockStatus === 'out-of-stock'
      ? 'text-red-600'
      : stockStatus === 'low-stock'
        ? 'text-amber-600'
        : 'text-green-600'

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Link
        to={backTo}
        aria-label='Back to products list'
        className='inline-flex items-center gap-1.5 mb-6 -ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to Products
      </Link>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Image */}
        <div className='space-y-3'>
          <div className='relative overflow-hidden bg-gray-100 rounded-xl aspect-4/3'>
            <img
              src={product.image}
              alt={product.name}
              className='w-full h-full object-cover'
            />
            <Badge variant='secondary' className='absolute top-3 left-3'>
              {product.category}
            </Badge>
            {stockStatus === 'out-of-stock' && (
              <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                <span className='text-white font-semibold bg-black/60 px-4 py-2 rounded'>
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className='space-y-5 flex flex-col'>
          <div>
            <p className='text-sm font-medium text-gray-500 mb-1'>
              {product.brand}
            </p>
            <h1 className='text-2xl font-bold text-gray-900 leading-tight'>
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  aria-hidden='true'
                />
              ))}
            </div>
            <span className='font-semibold text-gray-900'>
              {product.rating.toFixed(1)}
            </span>
            <span className='text-sm text-gray-500'>
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div>
            <span className='text-3xl font-bold text-gray-900'>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <Separator />

          {/* Description */}
          <p className='text-gray-600 text-sm leading-relaxed'>
            {product.description}
          </p>

          <Separator />

          {/* Meta */}
          <div className='space-y-2.5 text-sm'>
            <div className='flex items-center gap-2'>
              <Package className='w-4 h-4 text-gray-400' aria-hidden='true' />
              <span className='text-gray-500'>Availability:</span>
              <span className={`font-medium ${stockColor}`}>
                {stockStatus === 'out-of-stock'
                  ? 'Out of Stock'
                  : stockStatus === 'low-stock'
                    ? `Only ${product.stock} left in stock`
                    : `${product.stock} in stock`}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-gray-400' aria-hidden='true' />
              <span className='text-gray-500'>Brand:</span>
              <span className='font-medium text-gray-700'>{product.brand}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Hash className='w-4 h-4 text-gray-400' aria-hidden='true' />
              <span className='text-gray-500'>SKU:</span>
              <span className='font-mono text-gray-700 text-xs'>
                {product.sku}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
