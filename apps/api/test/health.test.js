import request from "supertest";
import { getTestApp, resetDb } from "./setup.js";

describe("GET /health", () => {
  let app;

  beforeAll(() => {
    app = getTestApp();
  });

  beforeEach(() => {
    resetDb();
  });

  test("should return standard success envelope with service and timestamp", async () => {
    const response = await request(app).get("/health").expect(200);

    // Assert standard envelope structure
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toBeDefined();

    // Assert data payload
    expect(response.body.data.service).toBe("api");
    expect(response.body.data.time).toBeDefined();
    expect(typeof response.body.data.time).toBe("string");

    // Assert time is valid ISO-like string
    const time = response.body.data.time;
    expect(time).toContain("T");
    expect(time.endsWith("Z") || time.includes("+") || time.includes("-")).toBe(true);

    // Verify time can be parsed as valid date
    const parsedDate = new Date(time);
    expect(parsedDate.toString()).not.toBe("Invalid Date");
  });
});
