import { createApp } from "../src/app.js";
import { db, initDb } from "../src/db/index.js";

let app;
let dbInitialized = false;

/**
 * Get test app instance
 * Initializes database only once per test run
 * @returns {import('express').Application}
 */
export function getTestApp() {
  if (!dbInitialized) {
    initDb();
    dbInitialized = true;
  }

  if (!app) {
    app = createApp();
  }

  return app;
}

/**
 * Reset database by clearing all tables
 * Call this in beforeEach or beforeAll to ensure test isolation
 */
export function resetDb() {
  // Clear tables in order to respect foreign key constraints
  db.prepare("DELETE FROM submissions").run();
  db.prepare("DELETE FROM form_fields").run();
  db.prepare("DELETE FROM forms").run();
}
