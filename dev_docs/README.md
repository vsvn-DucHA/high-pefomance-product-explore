# Developer Documentation

Thư mục này chứa tài liệu kỹ thuật cho team development, bao gồm:
- Refactoring logs
- Architecture decisions
- Performance optimizations
- Code review notes
- Migration guides

---

## 📁 Structure

```
dev_docs/
├── README.md                                    # This file
├── CHANGELOG.md                                 # Development history
├── refactor-2026-03-17-url-state-hooks.md      # Custom hooks extraction
├── hooks-api-reference.md                       # Custom hooks API docs
├── docker-setup.md                              # Docker deployment guide
└── (future docs...)
```

---

## 📚 Documents

### Setup & Deployment

#### [Docker Setup Guide](./docker-setup.md)
**Date:** 2026-03-17
**Type:** Infrastructure

Complete Docker setup with multi-stage builds:
- Development environment with hot-reload
- Production build with Nginx
- docker-compose for both modes
- Health checks and monitoring

**Quick Start:**
```bash
docker-compose up dev   # Development
docker-compose up prod  # Production
```

### API Reference

#### [Custom Hooks API Reference](./hooks-api-reference.md)
**Date:** 2026-03-17
**Type:** Documentation

Quick reference guide for all custom hooks:
- `useProductFilters` - URL-based filter state
- `useNavigateAfterLogin` - Post-login navigation
- `useProducts`, `useDebounce`, `useAuth`
- Usage examples and best practices

### Refactoring

#### [Refactor: URL State Management & Navigation Hooks](./refactor-2026-03-17-url-state-hooks.md)
**Date:** 2026-03-17
**Impact:** High - Dashboard.tsx reduced from 125 to 62 lines

Extracted business logic from Dashboard and LoginForm into reusable custom hooks:
- `useProductFilters` - URL state management for filters
- `useNavigateAfterLogin` - Smart redirect after authentication

**Key Metrics:**
- 📉 Dashboard complexity: 15 → 3
- 📉 Lines of code: -20.6%
- ✅ Testability: Improved significantly
- ✅ Reusability: 2 new reusable hooks

---

## 🎯 Purpose

Folder `dev_docs` phục vụ cho:

### 1. Knowledge Sharing
- Onboarding developers mới
- Share context về technical decisions
- Document "why" not just "what"

### 2. Code Evolution History
- Track major refactorings
- Understand evolution of architecture
- Reference for similar changes in future

### 3. Best Practices
- Showcase good patterns
- Document anti-patterns to avoid
- Performance optimization techniques

### 4. Decision Records
- Architecture Decision Records (ADRs)
- Technology choices
- Trade-offs and alternatives considered

---

## 📝 Document Template

Khi tạo document mới, include:

```markdown
# [Title]

**Date:** YYYY-MM-DD
**Type:** Refactor | Feature | Bugfix | Performance | Architecture
**Impact:** High | Medium | Low
**Status:** Completed | In Progress | Planned

## 📋 Context
[What problem are we solving?]

## 🎯 Goals
[What do we want to achieve?]

## ✅ Solution
[How did we solve it?]

## 📊 Metrics
[Measurable improvements]

## 🧪 Testing
[How to verify the change]

## 📚 References
[Related docs, articles, PRs]
```

---

## 🔗 Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Guidance for Claude Code
- [README.md](../README.md) - Project setup
- Architecture diagrams (future)
- API documentation (future)

---

## 🤝 Contributing

Khi thêm document mới:

1. ✅ Đặt tên file theo format: `[type]-YYYY-MM-DD-[slug].md`
2. ✅ Update danh sách documents trong README này
3. ✅ Include metrics và code examples
4. ✅ Add testing checklist
5. ✅ Link đến related PRs/commits

**Examples:**
- `refactor-2026-03-17-url-state-hooks.md`
- `perf-2026-03-18-virtual-scrolling-optimization.md`
- `arch-2026-03-20-migration-to-tanstack-router.md`

---

**Maintained by:** Development Team
**Last updated:** 2026-03-17
