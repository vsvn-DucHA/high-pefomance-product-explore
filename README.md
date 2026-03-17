# High-Performance Product Explorer

React application demonstrating high-performance product browsing with virtual scrolling, URL-based filters, and efficient state management for 10,000+ items.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for local dev)
- pnpm (recommended) or npm
- Docker (optional, for production deployment)

### Local Development

```bash
# Install dependencies
pnpm install

# Generate mock product data (10,000 products)
pnpm tsx scripts/generateProducts.ts

# Start development server
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173)

**Default credentials:** Any username/password (demo mode)

### Docker Production

```bash
# Build and run production container
docker-compose up -d

# Access at http://localhost
```

## 📦 Available Commands

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm tsx scripts/generateProducts.ts  # Generate products data
```

## 🛠 Tech Stack

- **React 19** + TypeScript + React Compiler
- **Vite 8** - Build tool with HMR
- **TanStack Query** - Data fetching & caching
- **TanStack Virtual** - Virtual scrolling for 10k items
- **React Router v7** - URL-first routing
- **shadcn/ui** - Accessible UI components
- **Tailwind CSS v4** - Styling

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Project architecture & patterns
- **[dev_docs/](./dev_docs/)** - Technical documentation, refactorings, API references

## 🏗 Project Structure

```
src/
├── components/    # UI components (auth, products, layout)
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # Business logic layer
├── context/       # React contexts (Auth)
├── types/         # TypeScript definitions
├── lib/           # Utilities (queryClient, utils)
└── data/          # products.json (generated)
```

## 🎯 Key Features

- ✅ Virtual scrolling (handles 10k products smoothly)
- ✅ URL-based filter state (shareable links)
- ✅ Real-time search with debouncing
- ✅ Multi-select category filters
- ✅ Price range slider
- ✅ Rating filter & sorting
- ✅ Authentication with protected routes
- ✅ Responsive design
- ✅ Accessibility (ARIA labels, keyboard nav)

## 📄 License

MIT
