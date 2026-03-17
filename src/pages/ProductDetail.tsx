import { useParams, Link, useLocation } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { ProductDetailView } from '@/components/products/ProductDetail'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const { state } = useLocation()
  const backTo = (state as { from?: string } | null)?.from ?? '/'
  const { data: product, isLoading } = useProduct(productId)

  if (isLoading) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
        <Skeleton className='w-full rounded-xl' />
        <div className='space-y-4'>
          <Skeleton className='h-6 w-1/3' />
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-10 w-1/4' />
          <Skeleton className='h-20 w-full' />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center px-4'>
        <AlertCircle
          className='w-16 h-16 text-gray-300 mb-4'
          aria-hidden='true'
        />
        <h1 className='text-2xl font-bold text-gray-700 mb-2'>
          Product Not Found
        </h1>
        <p className='text-gray-400 mb-6 max-w-xs'>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to={backTo}
          className='inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Products
        </Link>
      </div>
    )
  }

  return <ProductDetailView product={product} />
}
