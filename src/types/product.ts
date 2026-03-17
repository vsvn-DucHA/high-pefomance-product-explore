export type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Books & Media'

export const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
]

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  rating: number
  reviewCount: number
  stock: number
  image: string
  brand: string
  sku: string
  createdAt: string
}
