# Custom Hooks API Reference

Quick reference guide cho các custom hooks trong dự án.

---

## 🎣 useProductFilters

**File:** `src/hooks/useProductFilters.ts`

Hook để quản lý URL-based filter state cho product listing.

### Usage

```typescript
import { useProductFilters } from '@/hooks/useProductFilters'

function ProductPage() {
  const {
    filters,           // Current filter values
    setSearch,         // Update search query
    setCategories,     // Update selected categories
    setPriceRange,     // Update price range
    setMinRating,      // Update minimum rating
    setSortBy,         // Update sort order
    clearAll,          // Clear all filters
  } = useProductFilters()

  return (
    <div>
      <SearchInput value={filters.search} onChange={setSearch} />
      <CategoryFilters
        selected={filters.categories}
        onChange={setCategories}
      />
    </div>
  )
}
```

### Return Value

```typescript
{
  filters: Partial<FilterState>  // Current filter values from URL
  setSearch: (value: string) => void
  setCategories: (cats: Category[]) => void
  setPriceRange: (min: number, max: number) => void
  setMinRating: (rating: number) => void
  setSortBy: (value: SortBy) => void
  clearAll: () => void
}
```

### Filter State Type

```typescript
interface FilterState {
  search: string // Search query
  categories: Category[] // Selected categories
  priceMin: number // Min price (0-1000)
  priceMax: number // Max price (0-1000)
  minRating: number // Min rating (0-5)
  sortBy: SortBy // Sort order
}

type SortBy = 'price_asc' | 'price_desc' | 'rating' | 'name'
type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Garden'
  | 'Sports & Outdoors'
  | 'Books & Media'
```

### URL Mapping

| Filter     | URL Param   | Example                                   |
| ---------- | ----------- | ----------------------------------------- |
| search     | `search`    | `?search=laptop`                          |
| categories | `category`  | `?category=Electronics&category=Clothing` |
| priceMin   | `priceMin`  | `?priceMin=100`                           |
| priceMax   | `priceMax`  | `?priceMax=500`                           |
| minRating  | `minRating` | `?minRating=4`                            |
| sortBy     | `sortBy`    | `?sortBy=price_asc`                       |

### Examples

#### Basic Search

```typescript
const { filters, setSearch } = useProductFilters()

// User types "laptop"
setSearch('laptop')
// URL: ?search=laptop
// filters.search: "laptop"
```

#### Multiple Categories

```typescript
const { filters, setCategories } = useProductFilters()

// User selects Electronics and Clothing
setCategories(['Electronics', 'Clothing'])
// URL: ?category=Electronics&category=Clothing
// filters.categories: ['Electronics', 'Clothing']
```

#### Price Range

```typescript
const { setPriceRange } = useProductFilters()

// User adjusts slider to $100-$500
setPriceRange(100, 500)
// URL: ?priceMin=100&priceMax=500
```

#### Combined Filters

```typescript
const { setSearch, setCategories, setMinRating } = useProductFilters()

setSearch('gaming')
setCategories(['Electronics'])
setMinRating(4)
// URL: ?search=gaming&category=Electronics&minRating=4
```

#### Clear All Filters

```typescript
const { clearAll } = useProductFilters()

clearAll()
// URL: / (no params)
// All filters reset to defaults
```

### Features

- ✅ **URL Sync:** All filters automatically sync to URL
- ✅ **Shareable:** Copy URL to share exact filter state
- ✅ **History:** Browser back/forward works
- ✅ **Type Safe:** Full TypeScript support
- ✅ **Memoized:** Optimized re-renders
- ✅ **Nullish Handling:** Empty filters removed from URL

### Best Practices

#### ✅ DO

```typescript
// Use for URL-based filters
const { filters } = useProductFilters()
const { data } = useProducts(filters) // Pass to query

// Combine with other hooks
const { filters, setSearch } = useProductFilters()
const debouncedSearch = useDebounce(filters.search, 500)
```

#### ❌ DON'T

```typescript
// Don't manage same state in local state AND URL
const [search, setSearch] = useState('') // ❌ Redundant
const { filters } = useProductFilters()

// Don't mutate filters object
filters.search = 'new value' // ❌ Use setSearch instead
```

---

## 🧭 useNavigateAfterLogin

**File:** `src/hooks/useNavigateAfterLogin.ts`

Hook để navigate user về intended destination sau khi login thành công.

### Usage

```typescript
import { useNavigateAfterLogin } from '@/hooks/useNavigateAfterLogin'

function LoginForm() {
  const navigateAfterLogin = useNavigateAfterLogin()

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials)
      navigateAfterLogin() // ← Redirects to intended page
    } catch (error) {
      setError(error)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Parameters

```typescript
useNavigateAfterLogin(defaultRoute?: string)
```

- `defaultRoute`: Route to navigate if no "from" location (default: `'/'`)

### Return Value

```typescript
() => void  // Function to call after successful login
```

### How It Works

1. User tries to access protected route `/products/123`
2. Not authenticated → `ProtectedRoute` redirects to `/login` with `state.from = { pathname: '/products/123' }`
3. User logs in successfully
4. `navigateAfterLogin()` reads `state.from.pathname` and navigates there
5. If no `state.from`, navigates to `defaultRoute` (default: `'/'`)

> **Note:** Only `pathname` is preserved — query params from the original URL are not carried over to the post-login redirect.

### Examples

#### Basic Login Flow

```typescript
function LoginPage() {
  const navigateAfterLogin = useNavigateAfterLogin()

  const onLogin = (credentials) => {
    login(credentials)
    navigateAfterLogin() // → Goes to intended page or '/'
  }
}
```

#### Custom Default Route

```typescript
// Navigate to dashboard instead of homepage
const navigateAfterLogin = useNavigateAfterLogin('/dashboard')

onLogin()
// If no previous route → /dashboard
// If from /products/123 → /products/123
```

#### Social Login

```typescript
function GoogleLoginButton() {
  const navigateAfterLogin = useNavigateAfterLogin()

  const handleGoogleLogin = async () => {
    const { user } = await signInWithGoogle()
    if (user) {
      navigateAfterLogin()
    }
  }

  return <button onClick={handleGoogleLogin}>Google Login</button>
}
```

#### Magic Link

```typescript
function MagicLinkHandler() {
  const navigateAfterLogin = useNavigateAfterLogin()

  useEffect(() => {
    const verifyToken = async () => {
      const token = new URLSearchParams(location.search).get('token')
      if (token) {
        await verifyMagicLink(token)
        navigateAfterLogin()
      }
    }
    verifyToken()
  }, [])
}
```

### Features

- ✅ **Type Safe:** Proper TypeScript types for location state
- ✅ **Replace History:** Uses `replace: true` to avoid back button loop
- ✅ **Flexible:** Custom default route
- ✅ **Self-Documenting:** Clear intent from name
- ✅ **Reusable:** Works with any auth flow
- ⚠️ **pathname only:** Does not preserve search params from the pre-login URL

### Best Practices

#### ✅ DO

```typescript
// Use after successful authentication
const navigateAfterLogin = useNavigateAfterLogin()
await login(credentials)
navigateAfterLogin()

// Provide meaningful default
const navigateAfterLogin = useNavigateAfterLogin('/dashboard')
```

#### ❌ DON'T

```typescript
// Don't use for general navigation
const navigateAfterLogin = useNavigateAfterLogin()
navigateAfterLogin() // ❌ Only after login!

// Don't call before auth completes
navigateAfterLogin() // ❌ User not logged in yet
await login(credentials)
```

---

## 🎣 useProducts

**File:** `src/hooks/useProducts.ts`

TanStack Query hook để fetch và filter products.

### Usage

```typescript
import { useProducts } from '@/hooks/useProducts'

function ProductList() {
  const filters = { search: 'laptop', categories: ['Electronics'] }
  const { data: products, isLoading, isError } = useProducts(filters)

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

### Parameters

```typescript
useProducts(filters: Partial<FilterState>)
```

### Return Value

```typescript
{
  data: Product[]         // Filtered products (default: [])
  isLoading: boolean      // Initial load state
  isError: boolean        // Error state
  error: Error | null     // Error object
}
```

### Features

- ✅ **Automatic Caching:** TanStack Query cache by filter combination
- ✅ **Placeholder Data:** No flashing during filter changes
- ✅ **Infinite Stale Time:** Static data never refetches
- ✅ **Optimized Filtering:** In-memory filtering for 10k items

---

## 🎣 useDebounce

**File:** `src/hooks/useDebounce.ts`

Generic hook để debounce any value.

### Usage

```typescript
import { useDebounce } from '@/hooks/useDebounce'

function SearchInput() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 500)

  useEffect(() => {
    // Only runs after 500ms of no changes
    fetchResults(debouncedValue)
  }, [debouncedValue])

  return <input value={input} onChange={e => setInput(e.target.value)} />
}
```

### Parameters

```typescript
useDebounce<T>(value: T, delay?: number)
```

- `value`: Value to debounce
- `delay`: Delay in milliseconds (default: 500)

### Return Value

```typescript
T // Debounced value
```

---

## 🎣 useAuth

**File:** `src/hooks/useAuth.ts`

Hook để access authentication context.

### Usage

```typescript
import { useAuth } from '@/hooks/useAuth'

function UserMenu() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <button onClick={() => login(credentials)}>Login</button>
  }

  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Return Value

```typescript
{
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => void
  logout: () => void
}
```

---

## 📋 Quick Reference

| Hook                    | Purpose                 | Common Use Case             |
| ----------------------- | ----------------------- | --------------------------- |
| `useProductFilters`     | URL state for filters   | Dashboard, Search pages     |
| `useNavigateAfterLogin` | Post-login redirect     | Login, Social auth          |
| `useProducts`           | Fetch filtered products | Product lists               |
| `useDebounce`           | Debounce input          | Search, Filters             |
| `useAuth`               | Auth context access     | Protected routes, User menu |

---

**Last updated:** 2026-03-18
