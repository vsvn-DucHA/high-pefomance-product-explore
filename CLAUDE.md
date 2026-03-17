# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

High-performance React product explorer application that handles 10,000+ products with virtual scrolling, real-time filtering, and URL-driven state management. Built with React 19, TypeScript, TanStack ecosystem, and shadcn/ui.

## Development Commands

```bash
# Development server with HMR
pnpm dev

# Production build (TypeScript check + Vite build)
pnpm build

# Preview production build
pnpm preview

# Lint with ESLint
pnpm lint

# Generate mock product data (10,000 products)
pnpm tsx scripts/generateProducts.ts
```

## Architecture Overview

### URL-First State Management

All application state (search, filters, sorting) is stored in URL search parameters. This is the **single source of truth** for UI state.

- **Dashboard.tsx**: Reads `useSearchParams()` and converts to filter state
- **URL updates**: Use `updateParams()` helper which calls `setSearchParams()` with `{ replace: true }`
- **Multi-select categories**: URL key `category` can appear multiple times (e.g., `?category=Electronics&category=Clothing`)
- **Benefits**: Shareable URLs, browser back/forward works, no state sync bugs

### In-Memory Data Processing

Products are loaded once from `src/data/products.json` and filtered client-side:

- **productService.ts**: Pure filtering/sorting functions operating on 10k items array
- **useProducts hook**: TanStack Query with `queryKey: ['products', filters]` - filters in query key ensure automatic cache invalidation
- **Performance**: In-memory filtering is fast enough for 10k items; no pagination needed
- **Query config**: `staleTime: Infinity` because data is static JSON

### Virtual Scrolling Implementation

**ProductList.tsx** uses TanStack Virtual to render only visible items:

- Products are grouped into rows (1-4 columns responsive)
- Only ~20-30 visible rows rendered at any time
- `estimateSize: () => CARD_HEIGHT + GAP` (324px) with dynamic measurement
- Overscan of 5 rows for smooth scrolling
- Custom responsive column detection with `useColumns()` hook

### Provider Hierarchy

**Layout.tsx** establishes the provider stack (outer to inner):
1. `QueryClientProvider` - TanStack Query client
2. `AuthProvider` - Authentication context
3. Router `<Outlet />` - React Router nested routes

All child pages inherit these contexts.

### Authentication Flow

- **AuthContext**: Simple localStorage-based auth state
- **ProtectedRoute**: Wrapper component that checks auth and redirects to `/login`
- **authService**: Demo service that accepts any credentials (for prototyping)
- Auth state persists across refreshes via `localStorage`

### Path Aliases

`@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`)

```typescript
// Use this pattern for imports
import { ProductList } from '@/components/products/ProductList'
import type { Product } from '@/types/product'
```

### React Compiler

React Compiler (Babel plugin) is enabled in `vite.config.ts`. It provides automatic memoization - avoid manual `useMemo`/`useCallback` unless you see specific performance issues. Use `'use no memo'` directive to opt-out specific components if needed.

### Routing Structure

```
/ (Layout)
├── / (Dashboard - protected)
├── /products/:productId (ProductDetail - protected)
├── /login (LoginPage - public)
└── * (404)
```

All routes except `/login` require authentication.

### Key Files & Their Responsibilities

- **src/services/productService.ts**: Core filtering/sorting logic - modify here to change filter behavior
- **src/hooks/useProducts.ts**: TanStack Query integration - modify query config here
- **src/pages/Dashboard.tsx**: URL state management orchestration - all filter state flows through here
- **src/components/products/ProductList.tsx**: Virtual scrolling implementation
- **src/router/index.tsx**: Route definitions and protection
- **scripts/generateProducts.ts**: Regenerate mock data if product schema changes

### Data Generation

`products.json` contains 10,000 generated products. To regenerate (e.g., after changing Product schema):

```bash
pnpm tsx scripts/generateProducts.ts
```

The script creates products with:
- 5 categories (Electronics, Clothing, Home & Garden, Sports & Outdoors, Books & Media)
- Random prices ($10-$1000), ratings (1-5), stock (0-500)
- Placeholder images from picsum.photos
- UUIDs for ids, generated SKUs, timestamps

### Performance Considerations

- Virtual scrolling limits DOM nodes to ~100 regardless of product count
- TanStack Query caches filtered results - changing filters triggers new query
- `placeholderData: (prev) => prev` in useProducts prevents flashing during filter changes
- Debounced search input (500ms) in ProductSearch component
- React Compiler handles most optimization automatically

### Styling

- **Tailwind CSS v4** with Vite plugin (no PostCSS needed)
- **shadcn/ui**: Pre-built accessible components in `src/components/ui/`
- Add new shadcn components: `pnpm dlx shadcn@latest add [component-name]`
- Theme configured in `src/index.css` with CSS variables

### TypeScript Configuration

- **Path references**: `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`
- **Strict mode**: Enabled in `tsconfig.app.json`
- All types for domain models in `src/types/`
