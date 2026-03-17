import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortBy } from '@/types/filter'

interface ProductSortProps {
  value: SortBy
  onChange: (value: SortBy) => void
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className='flex items-center gap-2 shrink-0'>
      <span className='text-sm text-gray-500 hidden sm:inline'>Sort by:</span>
      <Select value={value} onValueChange={(v) => onChange(v as SortBy)}>
        <SelectTrigger className='w-45' aria-label='Sort products'>
          <SelectValue placeholder='Sort by...' />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
