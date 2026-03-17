# Development Changelog

Track major technical changes, refactorings, and improvements.

---

## [Unreleased]

### 🐛 Bugfixes

#### [2026-03-18] Fix filter reset bug in `useProductFilters`

**Files Changed:**

- 📝 MODIFIED: `src/hooks/useProductFilters.ts`

**Changes:**

- Removed `useMemo(..., [])` wrapper with `eslint-disable` from filter handlers
- The manual memoization with empty deps array created a stale closure conflict with `babel-plugin-react-compiler`, causing all filter handlers to overwrite the URL instead of merging params
- React Compiler now handles memoization automatically as intended

**Impact:** High

- ✅ Bug: Changing search or sort no longer resets other active filters
- ✅ Correctness: All `updateParams()` calls now use the latest `setSearchParams` reference

---

### 🧪 Testing

#### [2026-03-18] Set up Vitest unit/integration test suite

**Files Changed:**

- ✨ NEW: `vitest.config.ts`
- ✨ NEW: `src/test/setup.ts`
- ✨ NEW: `src/services/__tests__/productService.test.ts` (22 tests)
- ✨ NEW: `src/services/__tests__/authService.test.ts` (11 tests)
- ✨ NEW: `src/hooks/__tests__/useProductFilters.test.tsx` (18 tests)
- ✨ NEW: `src/hooks/__tests__/useProducts.test.tsx` (8 tests)
- ✨ NEW: `src/hooks/__tests__/useAuth.test.tsx` (5 tests)
- ✨ NEW: `src/hooks/__tests__/useDebounce.test.ts` (7 tests)
- ✨ NEW: `src/hooks/__tests__/useNavigateAfterLogin.test.tsx` (4 tests)
- 📝 MODIFIED: `package.json` (added test scripts)
- 📝 MODIFIED: `tsconfig.app.json` (added vitest/globals, @testing-library/jest-dom types)

**Changes:**

- Vitest config is separate from `vite.config.ts` to avoid conflict with `@rolldown/plugin-babel` (React Compiler)
- 75 tests total across 7 test files
- Coverage: ~99% statements, ~99% branches, 100% functions across `src/hooks/` and `src/services/`
- `useDebounce` tests use `vi.useFakeTimers()` to avoid real wait times
- `useProducts` and `useAuth` tests use proper provider wrappers (QueryClientProvider, AuthProvider + MemoryRouter)

**Impact:** High

- ✅ Confidence: All business logic is verified
- ✅ Regression prevention: Filter, sort, search logic fully covered
- ✅ CI-ready: `pnpm test:run` exits non-zero on failure

#### [2026-03-18] Set up Playwright E2E test suite

**Files Changed:**

- ✨ NEW: `playwright.config.ts`
- ✨ NEW: `e2e/helpers/auth.ts`
- ✨ NEW: `e2e/dashboard.spec.ts` (10 tests)
- ✨ NEW: `e2e/auth.spec.ts` (13 tests)
- ✨ NEW: `e2e/product-detail.spec.ts` (8 tests)

**Changes:**

- Playwright configured to auto-start Vite dev server before tests run
- Auth bypass helper injects user into `localStorage` to skip login UI in most tests
- `auth.spec.ts` tests the real login form including Zod validation, loading state, and logout via header dropdown
- `product-detail.spec.ts` tests navigation from dashboard → detail → back, 404 state, and auth guard
- `dashboard.spec.ts` tests search debounce, sort URL sync, and URL shareability

**Impact:** High

- ✅ Real browser coverage: Chromium headless
- ✅ Auth flows: Login form validation, logout, protected route redirect
- ✅ Navigation: Product detail, back button, filter persistence across navigation

---

### 🎉 Features

#### [2026-03-17] Docker Production Setup

**Files Changed:**

- ✨ NEW: `Dockerfile` (3-stage production build)
- ✨ NEW: `docker-compose.yml`
- ✨ NEW: `nginx.conf`
- ✨ NEW: `.dockerignore`
- ✨ NEW: `DOCKER_QUICKSTART.md`
- ✨ NEW: `dev_docs/docker-setup.md`
- 📝 MODIFIED: `README.md`

**Changes:**

- Added production-optimized multi-stage Dockerfile (~50MB final image)
- Created docker-compose for production deployment
- Configured Nginx with compression, caching, and security headers
- Added health check endpoint at `/health`
- Comprehensive Docker documentation

**Impact:** Medium

- ✅ Deployment: Production-ready container
- ✅ CI/CD: Container-based pipeline ready
- ✅ Cloud: Deploy to AWS, DigitalOcean, etc.
- ✅ Consistent: Same build everywhere

**Usage:** See [docker-setup.md](./docker-setup.md) or [DOCKER_QUICKSTART.md](../DOCKER_QUICKSTART.md)

### 🔄 Refactoring

#### [2026-03-17] Extract Custom Hooks for URL State & Navigation

**Files Changed:**

- ✨ NEW: `src/hooks/useProductFilters.ts`
- ✨ NEW: `src/hooks/useNavigateAfterLogin.ts`
- 📝 MODIFIED: `src/pages/Dashboard.tsx` (125 → 62 lines)
- 📝 MODIFIED: `src/components/auth/LoginForm.tsx`

**Changes:**

- Extracted URL state management logic from Dashboard into `useProductFilters` hook
- Created `useNavigateAfterLogin` hook for post-authentication navigation
- Reduced Dashboard complexity from 15 → 3 cyclomatic complexity
- Improved testability by isolating business logic

**Impact:** High

- ✅ Code maintainability: Much better
- ✅ Reusability: 2 new reusable hooks
- ✅ Lines of code: -20.6% in components
- ✅ Developer experience: Improved

**Migration:** See [refactor-2026-03-17-url-state-hooks.md](./refactor-2026-03-17-url-state-hooks.md)

---

## [Initial Release]

### 🎉 Features

#### [2026-03-16] Project Setup

**Core Stack:**

- React 19.2.4 + TypeScript 5.9.3
- Vite 8.0.0 with React Compiler
- TanStack Query + TanStack Virtual
- React Router v7
- shadcn/ui + Tailwind CSS v4

**Key Features:**

- ✅ Virtual scrolling for 10,000 products
- ✅ URL-based filter state
- ✅ Authentication with localStorage
- ✅ Responsive design
- ✅ Accessibility (ARIA labels, keyboard nav)

**Architecture:**

- URL-first state management
- In-memory data filtering
- Context-based authentication
- Service layer for business logic

---

## Legend

- 🎉 **Feature:** New functionality
- 🔄 **Refactor:** Code improvement without behavior change
- 🐛 **Bugfix:** Bug resolution
- ⚡ **Performance:** Performance optimization
- 📝 **Docs:** Documentation update
- 🔒 **Security:** Security improvement
- ✨ **NEW:** New file created
- 📝 **MODIFIED:** Existing file changed
- 🗑️ **DELETED:** File removed

---

**Format:**

```markdown
### [Category]

#### [YYYY-MM-DD] Title

**Files Changed:**

- STATUS: path/to/file

**Changes:**

- Brief description

**Impact:** High | Medium | Low
```
