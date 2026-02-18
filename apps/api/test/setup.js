import { createApp } from "../src/app.js";
import { db, initDb } from "../src/db/index.js";

let app;
let dbInitialized = false;

/**
 * Get test app instance
 * Initializes database only once per test run
 * @returns {Promise<import('express').Application>}
 */
export async function getTestApp() {
  if (!dbInitialized) {
    await initDb();
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
export async function resetDb() {
  // Clear tables in order to respect foreign key constraints
  await db.run("DELETE FROM submissions");
  await db.run("DELETE FROM form_fields");
  await db.run("DELETE FROM forms");
}
