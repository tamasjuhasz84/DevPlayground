# Dev Playground

[![CI](https://github.com/tamasjuhasz84/DevPlayground/actions/workflows/ci.yml/badge.svg)](https://github.com/tamasjuhasz84/DevPlayground/actions/workflows/ci.yml)

A pnpm monorepo demonstrating layered architecture with shared validation and consistent API contracts. Implements a dynamic form system using Vue 3, Express, and SQLite to showcase repository patterns, type-safe data flows, and build tooling.

**Focus:** Clean separation between frontend, backend, and shared logic. Zod schemas enforce validation at boundaries. Express routes delegate to repositories for data access. Vue components consume a typed API client with predictable error handling. CI pipeline validates code quality and test coverage on every commit.

---

## Why This Project Exists

This project prioritizes **architecture clarity over feature complexity**. Rather than building a feature-rich application, it demonstrates patterns that scale: layered backend structure (Routes → Controllers → Repositories → Database) with global error handling and DTO mapping at response boundaries, shared validation contracts via Zod, and predictable API envelope design (`{ok, data}` / `{ok, error}`).

The form builder domain was chosen for its natural fit with CRUD operations, schema validation, and dynamic rendering—allowing focus on **how** the system is structured rather than **what** it does. Every decision optimizes for readability, testability, and maintainability.

This is not a production app. It's a technical showcase for senior developers and hiring teams evaluating architectural thinking, code organization, and engineering discipline.

---

## Features

- **Form Builder** - Visual editor for creating dynamic forms with support for multiple field types (text, select, checkbox, rating)
- **Dynamic Form Rendering** - Client-side form generation from JSON schemas with real-time validation
- **Submission Management** - View, filter, and analyze form submissions with JSON payload inspection
- **Schema Versioning** - Update form schemas with field ordering, configuration, and validation rules
- **Demo Data Seeding** - One-click population of sample forms for testing and development
- **Type-Safe API** - Shared Zod schemas ensure consistency between frontend and backend

---

## Tech Stack

### Frontend

- **Vue 3** (Composition API with `<script setup>`)
- **Vite** - Lightning-fast dev server and build tool
- **Vuetify 3** - Material Design component library
- **Axios** - HTTP client with centralized error handling

### Backend

- **Node.js 22** - Modern JavaScript runtime
- **Express** - Minimalist web framework
- **sqlite3** - Primary persistence layer (embedded SQL database)
- **Zod** - Schema validation and type safety

### Infrastructure

- **pnpm** - Fast, disk space efficient package manager
- **Docker Compose** - PostgreSQL container included for future migration
- **Monorepo** - Shared code and coordinated versioning

---

## Getting Started

### Prerequisites

- Node.js 22.x (via nvm-windows or direct install)
- pnpm 10.29.3+
- Docker Desktop (for PostgreSQL)

### Installation

1. **Start the database**

   ```bash
   docker compose up -d
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start all services**

   ```bash
   pnpm dev
   ```

   This runs both API and web app in parallel:
   - **API**: http://localhost:3001
   - **Web**: http://localhost:5173

---

## Try it in 60 Seconds

Quick walkthrough to see the full form builder in action:

1. **Start Postgres**

   ```bash
   docker compose up -d
   ```

2. **Start dev servers**

   ```bash
   pnpm dev
   ```

3. **Create a form**
   - Navigate to http://localhost:5173/forms
   - Click "Create Form", enter a name (e.g., "Customer Feedback")
   - Click the edit icon to open Form Editor

4. **Seed demo schema**
   - Click "Seed Demo Form" to populate 5 sample fields
   - Click "Save Schema" to persist

5. **Fill the form**
   - Navigate to http://localhost:5173/fill
   - Select your form from the dropdown
   - Fill in values and click "Submit Form"

6. **View submissions**
   - Navigate to http://localhost:5173/submissions
   - Select your form to see all submissions
   - Click "View" to inspect the full JSON payload

**Total time:** ~60 seconds from zero to working form system! 🚀

---

## Environment Configuration

### API Environment Variables

Create `apps/api/.env`:

```env
# Database connection (Docker Postgres)
DATABASE_URL=postgresql://devplay:devplay@localhost:5432/devplay

# Server configuration
PORT=3001
NODE_ENV=development
```

> **Note**: The API currently uses SQLite (`sqlite3`) as the primary persistence layer. PostgreSQL via Docker Compose is included for future migration.

---

## Scripts

### Development

```bash
pnpm dev          # Start all workspaces in development mode
pnpm dev --filter @dp/api   # Start API only
pnpm dev --filter web       # Start web only
```

### Build

```bash
pnpm build        # Build all workspaces for production
```

### Testing

```bash
pnpm test         # Run tests across all workspaces
pnpm coverage     # Generate coverage reports for API and Web
```

### Linting & Formatting

```bash
pnpm lint         # Lint all workspaces
pnpm format       # Format code with prettier
```

---

## Folder Structure

```
dev-playground/
├── apps/
│   ├── api/                 # Express REST API
│   │   ├── src/
│   │   │   ├── db/          # Database layer (SQLite)
│   │   │   │   ├── models/  # Data models
│   │   │   │   └── repos/   # Repository pattern
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── middleware/  # Error handling, etc.
│   │   │   └── index.js     # Server entry point
│   │   └── data/            # SQLite database file
│   │
│   └── web/                 # Vue 3 + Vuetify SPA
│       ├── src/
│       │   ├── views/       # Page components
│       │   ├── components/  # Reusable components
│       │   ├── layouts/     # App shell layout
│       │   ├── router/      # Vue Router config
│       │   └── lib/         # API client, utilities
│       └── public/          # Static assets
│
├── packages/
│   └── shared/              # Shared code
│       └── src/
│           └── index.js     # Zod schemas (Form, Field, Submission)
│
├── docs/                    # Documentation
├── docker-compose.yml       # PostgreSQL service
└── pnpm-workspace.yaml      # Monorepo configuration
```

---

## Quality

### Linting & Code Style

- **ESLint** - Code quality and error detection
- **Prettier** - Consistent code formatting
- Run: `pnpm lint` and `pnpm format`

### Testing

**API Tests (Jest + Supertest)**  
Smoke tests verify server startup and health endpoints. Core route tests cover CRUD operations for forms and submissions.

**Web Tests (Vitest + jsdom)**  
Component smoke tests ensure views render without errors. API client unit tests validate request/response handling.

Run all tests: `pnpm test`  
Generate coverage: `pnpm coverage`

Coverage reports are generated in `apps/api/coverage/` and `apps/web/coverage/` directories (lcov + HTML format).

### Continuous Integration

**GitHub Actions** runs on every push and pull request to `main` and `develop` branches:

The pipeline executes: format check → lint → build → test → coverage, ensuring code quality on every commit. Coverage reports are uploaded as workflow artifacts for review.

---

## Architecture

For detailed architecture decisions, design patterns, and data flow diagrams, see:

**[Architecture Documentation](docs/architecture.md)**

Key highlights:

- **Repository Pattern** for database abstraction
- **Centralized validation** with Zod schemas
- **API client with unwrapping** for consistent error handling
- **Component composition** with Vue 3 Composition API

---

## Roadmap

### Architecture & Quality Improvements

- **Test Coverage Expansion** - Increase unit test coverage across repositories and utilities
- **End-to-End Testing** - Playwright test suite for critical user flows
- **CI Pipeline Hardening** - Add matrix testing across Node versions, parallel job execution
- **Database Abstraction** - Migrate from direct SQLite queries to Prisma ORM for type safety
- **Integration Tests** - Test database transactions and repository layer edge cases
- **API Contract Testing** - Schema validation tests to prevent breaking changes

---

## Development Notes

### Database Reset

```bash
# Remove SQLite database
rm apps/api/data/dev.sqlite

# Restart API to reinitialize
pnpm --filter @dp/api dev
```

### sqlite3 on Windows

If you encounter native binding errors after switching Node versions:

```bash
cd apps/api
pnpm rebuild sqlite3
```

---

## License

This project is for demonstration purposes.

---

**Built by** [Tamas_Juhasz] | Showcasing full-stack JavaScript expertise
