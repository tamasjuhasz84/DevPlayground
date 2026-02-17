# Architecture

## Overview

**Dev Playground** is a pnpm monorepo showcasing a full-stack form builder application with a clean separation of concerns. The architecture follows a three-layer approach: frontend SPA, backend REST API, and shared validation logic.

---

## Monorepo Layout

```
dev-playground/
├── apps/
│   ├── api/          # Express.js REST API (port 3001)
│   └── web/          # Vue 3 + Vite SPA (port 5173)
├── packages/
│   └── shared/       # Shared schemas and validation (Zod)
└── docker-compose.yml
```

### Responsibilities

- **`apps/api`**: Handles all business logic, database operations (via better-sqlite3 or Postgres), and exposes RESTful endpoints. Routes → Controllers → Repositories → Database.

- **`apps/web`**: Vue 3 single-page application with Vuetify components. Communicates with API via axios client (`src/lib/api.js`). Responsibilities include UI rendering, form validation, and navigation.

- **`packages/shared`**: Contains Zod schemas for request/response validation, ensuring both frontend and backend use the same data contracts. Linked via pnpm workspace protocol.

---

## Database

The API connects to a database via the `DATABASE_URL` environment variable. Two options are supported:

- **SQLite** (current): `file:./data/dev.sqlite` for local development
- **PostgreSQL** (production-ready): Runs via `docker-compose.yml` on port 5432

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: devplay
      POSTGRES_USER: devplay
      POSTGRES_PASSWORD: devplay
```

---

## Request/Response Flow

### 1. Creating a Form

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Vue UI  │   POST /forms  │ Express  │   INSERT INTO  │ Database │
│  (web)   │───────────────>│   API    │───────────────>│ (SQLite) │
└──────────┘   {name, desc} └──────────┘   forms table  └──────────┘
                     │                            │
                     │<───────────────────────────┘
                     │   {ok:true, data: form}
```

**Steps:**

1. User clicks "Create Form" in `FormsView.vue`
2. Frontend sends `POST /api/forms` with `{name, description}`
3. API validates with Zod, inserts into `forms` table
4. Returns `{ok: true, data: {id, name, description, status, createdAt}}`
5. Frontend navigates to `/forms/:id/edit`

---

### 2. Saving Schema

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Editor  │  PUT /forms/:id│ Express  │   UPDATE/INSERT│ Database │
│  (Vue)   │─────/schema────>│   API    │───────────────>│          │
└──────────┘  {name,fields[]}└──────────┘  forms+fields └──────────┘
```

**Steps:**

1. User edits form name/description and adds fields in `FormEditorView.vue`
2. Clicks "Save Schema" → triggers `PUT /api/forms/:id/schema`
3. Payload includes: `{name, description, status, fields: [{label, type, ord, config}]}`
4. API deletes old fields, inserts new ones
5. Returns `{ok: true, data: {form, fields}}`

---

### 3. Filling and Submitting

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ FillView │ GET /forms/:id │ Express  │  SELECT fields │ Database │
│  (Vue)   │───────────────>│   API    │───────────────>│          │
└──────────┘                └──────────┘                └──────────┘
     │                            │
     │<───────────────────────────┘
     │   {ok:true, data:{form,fields}}
     │
     │  User fills form
     │
     v
┌──────────┐                ┌──────────┐                ┌──────────┐
│ FillView │POST /forms/:id │ Express  │INSERT INTO     │ Database │
│  (Vue)   │───/submissions─>│   API    │ submissions   │          │
└──────────┘  {payload:{}}  └──────────┘                └──────────┘
```

**Steps:**

1. User navigates to `/fill?formId=123`
2. Frontend fetches form + fields via `GET /api/forms/:id`
3. Dynamically renders fields based on type (text, select, checkbox, rating)
4. User fills values, clicks Submit
5. Frontend validates, then sends `POST /api/forms/:id/submissions` with `{payload: {fieldLabel: value}}`
6. API stores submission with `formId`, `payload` JSON, and `createdAt` timestamp

---

### 4. Listing Submissions

```
┌──────────────┐            ┌──────────┐                ┌──────────┐
│ Submissions  │   GET      │ Express  │  SELECT *      │ Database │
│  View (Vue)  │─/forms/:id/│   API    │───FROM subs───>│          │
└──────────────┘ submissions└──────────┘  WHERE formId  └──────────┘
       │                          │                            │
       │<─────────────────────────┼────────────────────────────┘
       │  {ok:true, data:[{id, payload, createdAt}]}
       │
       v
   Display in v-data-table with JSON preview
```

**Steps:**

1. User selects a form in `SubmissionsView.vue`
2. Frontend calls `GET /api/forms/:id/submissions`
3. API queries submissions, returns array sorted latest-first
4. Frontend displays in table, allows viewing full JSON payload

---

## API Response Format

All endpoints follow a consistent envelope pattern:

**Success:**

```json
{
  "ok": true,
  "data": {
    /* actual payload */
  }
}
```

**Error:**

```json
{
  "ok": false,
  "error": {
    "message": "Validation failed",
    "details": [
      /* optional */
    ]
  }
}
```

Frontend's `api.js` unwraps responses via helper functions (`unwrap`, `toErrorMessage`).

---

## ASCII Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐   │
│  │ FormsView  │  │FormEditor  │  │ FillView │  │Submissions│   │
│  └─────┬──────┘  └─────┬──────┘  └────┬─────┘  └────┬─────┘   │
│        │                │              │             │          │
│        └────────────────┴──────────────┴─────────────┘          │
│                         │                                        │
│                    axios (api.js)                                │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      apps/api (Express)                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Routes  (/forms, /submissions)                        │    │
│  └────────┬───────────────────────────────────────────────┘    │
│           ▼                                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Repositories (formsRepo, submissionsRepo)             │    │
│  └────────┬───────────────────────────────────────────────┘    │
│           ▼                                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Database Models (Form, FormField, Submission)         │    │
│  └────────┬───────────────────────────────────────────────┘    │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ▼
   ┌─────────────────┐         ┌──────────────────────┐
   │  SQLite (dev)   │   OR    │  PostgreSQL (docker) │
   │  data/dev.sqlite│         │  port 5432           │
   └─────────────────┘         └──────────────────────┘

            ▲
            │  Shared validation
            │
   ┌────────┴─────────┐
   │ packages/shared  │
   │  (Zod schemas)   │
   └──────────────────┘
```

---

## Design Decisions

1. **Monorepo with pnpm workspaces**: Enables code sharing, unified dependency management, and atomic commits across frontend/backend. Packages are linked via `workspace:*` protocol.

2. **Shared validation schemas**: Zod schemas in `packages/shared` ensure consistent data contracts between frontend and backend, reducing bugs and duplication.

3. **Dockerized database**: PostgreSQL runs in Docker for production parity and easy local setup. No manual database installation required—just `docker compose up -d`.

4. **Clean API response format**: All endpoints use `{ok, data}` or `{ok, error}` envelopes. This simplifies error handling in the frontend and provides predictable structure.

5. **Simple MVP first**: Focus on core functionality (create, edit, fill, submit) with minimal dependencies. Complexity (auth, file uploads, real-time) deferred to future iterations for faster validation.

---

## Technology Stack

- **Frontend**: Vue 3 (Composition API), Vuetify 3, Vue Router, Axios
- **Backend**: Node.js 22, Express.js, better-sqlite3 or pg
- **Validation**: Zod (shared)
- **Infrastructure**: Docker Compose, pnpm workspaces
- **Database**: SQLite (dev), PostgreSQL 16 (production-ready)

---

## Future Enhancements

See [README.md](../README.md#-roadmap) for planned features including authentication, CI/CD, real-time updates, and export functionality.
