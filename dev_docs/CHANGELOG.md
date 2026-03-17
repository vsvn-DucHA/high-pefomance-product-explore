# Development Changelog

Track major technical changes, refactorings, and improvements.

---

## [Unreleased]

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
