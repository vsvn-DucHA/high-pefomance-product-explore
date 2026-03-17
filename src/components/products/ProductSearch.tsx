import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [inputValue, setInputValue] = useState(value)
  const debouncedValue = useDebounce(inputValue, 400)

  // Sync with external value changes (e.g. URL change)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Emit debounced value
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <div className='relative flex-1 max-w-xl'>
      <Search
        className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none'
        aria-hidden='true'
      />
      <Input
        type='search'
        placeholder='Search products by name, brand...'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className='pl-9 pr-9'
        aria-label='Search products'
      />
      {inputValue && (
        <Button
          variant='ghost'
          size='sm'
          onClick={handleClear}
          className='absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 p-0 hover:bg-gray-100 rounded-full'
          aria-label='Clear search'
        >
          <X className='w-3.5 h-3.5' />
        </Button>
      )}
    </div>
  )
}
