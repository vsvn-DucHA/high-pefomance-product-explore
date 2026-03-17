/// <reference types="node" />
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type Category = 'Electronics' | 'Clothing' | 'Home & Garden' | 'Sports & Outdoors' | 'Books & Media'

const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
]

const BRANDS = [
  'TechPro', 'StyleMax', 'HomeComfort', 'FitGear', 'ReadWorld',
  'NovaTech', 'UrbanWear', 'GardenPlus', 'ActiveZone', 'PageTurner',
  'EliteElec', 'FashionHub', 'CozyHome', 'TrailBlazer', 'KnowledgeBase',
  'PixelPower', 'TrendSet', 'NatureCraft', 'SportEdge', 'IntelliRead',
]

const PRODUCT_NAMES_BY_CATEGORY: Record<Category, string[]> = {
  Electronics: [
    'Wireless Headphones', 'Smart Watch', 'Laptop', 'Tablet', 'Smartphone',
    'Bluetooth Speaker', 'Mechanical Keyboard', 'Gaming Mouse', 'Webcam', 'Monitor',
    'External SSD', 'USB Hub', 'Smart TV', 'Action Camera', 'Drone',
    'VR Headset', 'Smart Speaker', 'Fitness Tracker', 'Wireless Charger', 'LED Strip',
  ],
  Clothing: [
    'Running Shoes', 'Denim Jacket', 'Polo Shirt', 'Yoga Pants', 'Winter Coat',
    'Casual Hoodie', 'Linen Shirt', 'Slim Jeans', 'Fleece Vest', 'Raincoat',
    'Cargo Shorts', 'Turtleneck Sweater', 'Sports Bra', 'Trench Coat', 'Tank Top',
    'Hiking Boots', 'Evening Dress', 'Swim Trunks', 'Wool Scarf', 'Baseball Cap',
  ],
  'Home & Garden': [
    'Coffee Maker', 'Air Purifier', 'Robot Vacuum', 'Blender', 'Instant Pot',
    'Desk Lamp', 'Throw Pillow', 'Candle Set', 'Plant Pot', 'Kitchen Scale',
    'Water Filter', 'Diffuser', 'Shower Head', 'Garden Hose', 'Compost Bin',
    'Solar Light', 'Door Mat', 'Storage Basket', 'Wall Clock', 'Herb Kit',
  ],
  'Sports & Outdoors': [
    'Yoga Mat', 'Resistance Bands', 'Camping Tent', 'Hiking Backpack', 'Trekking Poles',
    'Sports Water Bottle', 'Jump Rope', 'Foam Roller', 'Sleeping Bag', 'Fishing Rod',
    'Climbing Harness', 'Cycling Helmet', 'Tennis Racket', 'Basketball', 'Rowing Machine',
    'Skateboard', 'Kayak Paddle', 'Trail Running Shoes', 'Gym Gloves', 'Pull-Up Bar',
  ],
  'Books & Media': [
    'Programming Guide', 'Fantasy Novel', 'Science Atlas', 'Cookbook', 'History Book',
    'Design Handbook', 'Self-Help Book', 'Travel Guide', 'Biography', 'Art Book',
    'Children\'s Storybook', 'Business Strategy', 'Mystery Thriller', 'Poetry Collection', 'Science Fiction',
    'Language Learning', 'Philosophy Text', 'Health & Wellness', 'Nature Journal', 'Technology Insights',
  ],
}

const ADJECTIVES = [
  'Premium', 'Pro', 'Elite', 'Ultra', 'Max', 'Mini', 'Classic', 'Smart', 'Eco', 'Deluxe',
  'Essential', 'Advanced', 'Compact', 'Portable', 'Heavy-Duty', 'Lightweight', 'Ergonomic', 'Wireless',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateProduct(index: number) {
  const category = randomFrom(CATEGORIES)
  const baseName = randomFrom(PRODUCT_NAMES_BY_CATEGORY[category])
  const adjective = Math.random() > 0.6 ? randomFrom(ADJECTIVES) + ' ' : ''
  const brand = randomFrom(BRANDS)
  const name = `${adjective}${brand} ${baseName}`

  const price = randomFloat(9.99, 999.99)
  const rating = randomFloat(1, 5)
  const reviewCount = randomInt(0, 2500)
  const stock = randomInt(0, 500)

  const imageId = randomInt(1, 1000)
  const imageCategory = category === 'Electronics' ? 'tech' :
    category === 'Clothing' ? 'fashion' :
    category === 'Home & Garden' ? 'interior' :
    category === 'Sports & Outdoors' ? 'nature' : 'books'

  const descriptions = [
    `High-quality ${baseName.toLowerCase()} from ${brand}. Perfect for everyday use with premium materials.`,
    `${brand}'s latest ${baseName.toLowerCase()} features advanced technology and superior craftsmanship.`,
    `Experience the difference with ${brand} ${baseName.toLowerCase()}. Built to last and designed for performance.`,
    `The ${adjective.trim() || 'best'} ${baseName.toLowerCase()} on the market. ${brand} delivers quality you can trust.`,
  ]

  return {
    id: uuidv4(),
    name,
    description: randomFrom(descriptions),
    price,
    category,
    rating,
    reviewCount,
    stock,
    image: `https://picsum.photos/seed/${imageCategory}${imageId}/400/300`,
    brand,
    sku: `${brand.substring(0, 3).toUpperCase()}-${category.substring(0, 3).toUpperCase()}-${String(index).padStart(5, '0')}`,
    createdAt: new Date(Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString(),
  }
}

console.log('Generating 10,000 products...')
const products = Array.from({ length: 10000 }, (_, i) => generateProduct(i + 1))

const outputDir = join(__dirname, '../src/data')
mkdirSync(outputDir, { recursive: true })
const outputPath = join(outputDir, 'products.json')

writeFileSync(outputPath, JSON.stringify(products, null, 2))
console.log(`✔ Generated ${products.length} products → ${outputPath}`)
