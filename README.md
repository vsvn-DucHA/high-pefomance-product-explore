# High-Performance Product Explorer

React application demonstrating high-performance product browsing with virtual scrolling, URL-based filters, and efficient state management for 10,000+ items.

**Live Demo:** [https://high-pefomance-product-explore.vercel.app/](https://high-pefomance-product-explore.vercel.app/)

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
pnpm dev                              # Start dev server with HMR
pnpm build                            # Build for production
pnpm preview                          # Preview production build
pnpm lint                             # Run ESLint
pnpm tsx scripts/generateProducts.ts  # Regenerate products data

# Testing
pnpm test:run         # Run all unit/integration tests once
pnpm test             # Vitest watch mode
pnpm test:ui          # Vitest browser UI
pnpm test:coverage    # Coverage report → coverage/index.html
pnpm test:e2e         # Playwright E2E tests (auto-starts dev server)
pnpm test:e2e:ui      # Playwright interactive UI
pnpm test:e2e:headed  # E2E with visible browser window
```

## 🧪 Testing

The project uses two independent test stacks:

| Stack                  | Purpose                            | Tools                            |
| ---------------------- | ---------------------------------- | -------------------------------- |
| **Unit / Integration** | Test hooks, services, pure logic   | Vitest + jsdom + Testing Library |
| **E2E**                | Test real browser flows end-to-end | Playwright + Chromium            |

### Run Unit & Integration Tests

```bash
# Run all at once (CI-friendly)
pnpm test:run

# Watch mode (rerun automatically when the file changes)
pnpm test

# Open Vitest UI (Intuitive interface)
pnpm test:ui

# Coverage report (export to coverage/index.html)
pnpm test:coverage
```

### Run E2E Tests (Playwright)

> The dev server will be **automatically started** before Playwright runs — no need to run `pnpm dev` first.

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Open Playwright UI to see each step
pnpm test:e2e:ui

# Run with the browser showing the screen
pnpm test:e2e:headed
```

### First time installing Playwright browsers

```bash
npx playwright install chromium
```

### Coverage

```
All files  | ~99% Statements | ~99% Branches | 100% Functions | 100% Lines
```

### Test directory structure

```
src/
├── services/__tests__/
│   ├── productService.test.ts   # Unit: filter/sort/search logic
│   └── authService.test.ts      # Unit: localStorage auth
└── hooks/__tests__/
    ├── useProductFilters.test.tsx  # Integration: URL ↔ filter state
    ├── useProducts.test.tsx        # Integration: TanStack Query
    ├── useAuth.test.tsx            # Integration: AuthContext
    ├── useDebounce.test.ts         # Unit: debounce timing (fake timers)
    └── useNavigateAfterLogin.test.tsx  # Unit: navigation logic

e2e/
├── dashboard.spec.ts       # E2E: search, sort, URL shareability, auth redirect
├── auth.spec.ts            # E2E: login form, validation, logout flow
├── product-detail.spec.ts  # E2E: product card navigation, detail page, back nav
└── helpers/
    └── auth.ts             # localStorage auth bypass helper
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

## 🤖 AI Usage Disclosure

This project was developed with AI assistance (GitHub Copilot / Claude). Below is a transparent breakdown of how AI was used and what remained human-driven.

### What AI helped with

| Area                        | How AI was used                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Planning & architecture** | Proposed URL-first state management pattern, virtual scrolling strategy, and provider hierarchy before any code was written                                        |
| **Docs lookup**             | Fetched up-to-date API references for TanStack Virtual v3, React Router v7, and Vitest v4 to avoid outdated patterns                                               |
| **Test generation**         | Generated unit, integration, and E2E test scaffolding; suggested edge cases (stale timers, empty deps arrays, localStorage corruption)                             |
| **Bug hypothesis**          | Identified the `useMemo(..., [])` + React Compiler conflict that caused filter resets — surfaced as a candidate hypothesis for the developer to verify and confirm |
| **Boilerplate**             | Config files (`vitest.config.ts`, `playwright.config.ts`), provider wrappers in tests, Playwright auth helpers                                                     |
| **Documentation**           | Drafted `CHANGELOG.md` entries, `hooks-api-reference.md`, and `dev_docs/` structure                                                                                |

### What remained human-driven

- Final decisions on all architecture trade-offs
- Verification and confirmation of bugs before fixing
- Product requirements and UX decisions
- Code review and approval of every AI-suggested change
- Judgment on which test cases reflect real user risk vs. low-value coverage

## 📄 License

MIT
