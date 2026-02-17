import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file location
const dbPath = path.resolve(__dirname, "../../data/dev.sqlite");
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

/**
 * Initialize database tables
 */
export function initDb() {
  try {
    // Create forms table
    db.exec(`
      CREATE TABLE IF NOT EXISTS forms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create form_fields table
    db.exec(`
      CREATE TABLE IF NOT EXISTS form_fields (
        id TEXT PRIMARY KEY,
        formId TEXT NOT NULL,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        label TEXT,
        required INTEGER NOT NULL DEFAULT 0,
        ord INTEGER NOT NULL DEFAULT 0,
        config TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(formId) REFERENCES forms(id) ON DELETE CASCADE
      )
    `);

    // Create submissions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        formId TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(formId) REFERENCES forms(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    throw error;
  }
}

/**
 * Generate a UUID
 * @returns {string} UUID
 */
export function uuid() {
  return crypto.randomUUID();
}

/**
 * Get current timestamp in ISO format
 * @returns {string} ISO timestamp
 */
export function nowIso() {
  return new Date().toISOString();
}
