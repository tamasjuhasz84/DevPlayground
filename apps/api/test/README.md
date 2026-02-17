# API Tests

## Overview

API tests use **Jest** and **Supertest** to validate API endpoints without binding to a port.

## Running Tests

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Database Requirements

**Important:** Tests use the same SQLite database (`apps/api/data/dev.sqlite`) as the development environment. This is a pragmatic approach that doesn't require Docker.

### Considerations

- Tests modify the actual development database
- For isolated testing, delete `apps/api/data/dev.sqlite` before running tests
- Future improvement: Use in-memory SQLite (`:memory:`) for full isolation

## Test Structure

- `health.test.js` - Health endpoint smoke tests
- `forms.test.js` - Form CRUD operations, schema saving, field ordering

## Architecture

Tests import the Express app directly via `createApp()` from `src/app.js`, bypassing server startup. Supertest handles HTTP requests internally without network overhead.
