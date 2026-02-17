import request from "supertest";
import { createApp } from "../src/app.js";
import { initDb } from "../src/db/index.js";

describe("GET /health", () => {
  let app;

  beforeAll(() => {
    // Initialize database before tests
    initDb();
    app = createApp();
  });

  test("should return 200 status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });

  test("should return ok: true", async () => {
    const response = await request(app).get("/health");
    expect(response.body.ok).toBe(true);
  });

  test("should include service name and timestamp", async () => {
    const response = await request(app).get("/health");
    expect(response.body.service).toBe("api");
    expect(response.body.time).toBeDefined();
    expect(typeof response.body.time).toBe("string");
  });
});
