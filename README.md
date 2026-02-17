# Dev Playground

![CI Status](https://github.com/YOUR_GITHUB_USERNAME/dev-playground/actions/workflows/ci.yml/badge.svg)

A full-stack monorepo demonstrating modern web development practices with dynamic form building, real-time data handling, and enterprise-grade architecture.

**Dev Playground** is a production-ready demonstration project showcasing end-to-end TypeScript development in a pnpm monorepo. Built with Vue 3, Express, and PostgreSQL, it features a complete form management system—from schema design to submission analytics—emphasizing clean architecture, type safety, and developer experience.

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
- **Better SQLite3** - Embedded SQL database with native performance
- **Zod** - TypeScript-first schema validation

### Infrastructure

- **pnpm** - Fast, disk space efficient package manager
- **Docker Compose** - PostgreSQL containerization (migration ready)
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

> **Note**: The API currently uses SQLite (`better-sqlite3`) for rapid development. Docker Postgres is available for future migration to Prisma.

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

#### API Tests (Jest + Supertest)

- Smoke tests verify server startup and health endpoints
- Core route tests cover CRUD operations for forms and submissions
- Run: `pnpm --filter @dp/api test`
- Coverage: `pnpm --filter @dp/api test:coverage`

#### Web Tests (Vitest)

- Component smoke tests ensure views render without errors
- API client unit tests validate request/response handling
- Run: `pnpm --filter web test`
- Coverage: `pnpm --filter web test:coverage`

#### Coverage Reports

Coverage reports are generated in:

- `apps/api/coverage/` - API test coverage (lcov + HTML)
- `apps/web/coverage/` - Frontend test coverage (lcov + HTML)

Open `coverage/index.html` in your browser to view detailed coverage metrics.

### Continuous Integration

**GitHub Actions** pipeline runs on every push and pull request:

1. **Install** - Restore pnpm cache and install dependencies
2. **Lint** - Run ESLint across all workspaces
3. **Test** - Execute Jest and Vitest test suites
4. **Coverage** - Generate and upload coverage reports

CI badge status displayed at the top of this README.

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

### Planned Enhancements

- **CI/CD Pipeline** - GitHub Actions for automated testing and deployment
- **Unit & E2E Tests** - Vitest + Playwright test suites
- **Real-time Status Dashboard** - WebSocket-based live submission monitoring
- **CSV/Excel Export** - Bulk submission data export functionality
- **Form Templates** - Pre-built form schemas for common use cases
- **Field Validation Rules** - Advanced validation (regex, min/max, custom logic)
- **Multi-language Support** - i18n for form labels and UI
- **Prisma Migration** - Transition from SQLite to PostgreSQL with Prisma ORM

---

## Development Notes

### Database Reset

```bash
# Remove SQLite database
rm apps/api/data/dev.sqlite

# Restart API to reinitialize
pnpm --filter @dp/api dev
```

### Better-SQLite3 on Windows

If you encounter native binding errors after switching Node versions:

```bash
cd apps/api
pnpm rebuild better-sqlite3
```

---

## License

This project is for demonstration purposes.

---

**Built by** [Tamas_Juhasz] | Showcasing full-stack JavaScript expertise
