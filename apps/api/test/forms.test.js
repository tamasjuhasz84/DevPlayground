import request from "supertest";
import { getTestApp, resetDb } from "./setup.js";

/**
 * Helper function to create a test form
 * @param {Object} app - Express app instance
 * @param {Object} overrides - Optional form data overrides
 * @returns {Promise<string>} The created form ID
 */
async function createTestForm(app, overrides = {}) {
  const defaultFormData = {
    name: "Test Form",
    description: "Test description",
  };

  const formData = { ...defaultFormData, ...overrides };
  const response = await request(app).post("/forms").send(formData);
  return response.body.data.id;
}

describe("Forms API", () => {
  let app;

  beforeAll(() => {
    app = getTestApp();
  });

  beforeEach(() => {
    resetDb();
  });

  describe("POST /forms", () => {
    test("should create a form", async () => {
      const formData = {
        name: "Test Form",
        description: "A test form for Jest",
      };

      const response = await request(app).post("/forms").send(formData).expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe(formData.name);
      expect(response.body.data.description).toBe(formData.description);
      expect(response.body.data.status).toBe("active");
      expect(response.body.data.createdAt).toBeDefined();
    });

    test("should reject form without name", async () => {
      const response = await request(app)
        .post("/forms")
        .send({ description: "No name provided" })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
      expect(response.body.error.message).toBeDefined();
      expect(Array.isArray(response.body.error.details)).toBe(true);
    });
  });

  describe("PUT /forms/:id/schema", () => {
    test("should save fields with proper ordering", async () => {
      const formId = await createTestForm(app);
      const schemaData = {
        name: "Updated Test Form",
        description: "Updated description",
        status: "active",
        fields: [
          {
            type: "text",
            name: "firstName",
            label: "First Name",
            required: true,
            ord: 1,
          },
          {
            type: "text",
            name: "lastName",
            label: "Last Name",
            required: true,
            ord: 2,
          },
          {
            type: "select",
            name: "country",
            label: "Country",
            required: false,
            ord: 3,
            config: {
              options: ["USA", "Canada", "UK"],
            },
          },
        ],
      };

      const response = await request(app)
        .put(`/forms/${formId}/schema`)
        .send(schemaData)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(schemaData.name);
      expect(response.body.data.fields).toBeDefined();
      expect(response.body.data.fields).toHaveLength(3);
    });

    test("should reject invalid field type", async () => {
      const formId = await createTestForm(app);

      const invalidSchema = {
        name: "Test Form",
        fields: [
          {
            type: "invalid-type",
            name: "test",
            label: "Test Field",
            ord: 1,
          },
        ],
      };

      const response = await request(app)
        .put(`/forms/${formId}/schema`)
        .send(invalidSchema)
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
      expect(response.body.error.message).toBeDefined();
      expect(Array.isArray(response.body.error.details)).toBe(true);
    });
  });

  describe("GET /forms/:id", () => {
    test("should return fields in ord order", async () => {
      // First, create a form with unordered fields
      const formResponse = await request(app).post("/forms").send({ name: "Order Test Form" });

      const formId = formResponse.body.data.id;

      // Add fields with specific order
      const schema = {
        name: "Order Test Form",
        fields: [
          { type: "text", name: "field3", label: "Third", ord: 3 },
          { type: "text", name: "field1", label: "First", ord: 1 },
          { type: "text", name: "field2", label: "Second", ord: 2 },
        ],
      };

      await request(app).put(`/forms/${formId}/schema`).send(schema);

      // Get the form and check field order
      const response = await request(app).get(`/forms/${formId}`).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.fields).toBeDefined();
      expect(response.body.data.fields).toHaveLength(3);

      // Verify fields are ordered by ord
      const fields = response.body.data.fields;
      expect(fields[0].ord).toBe(1);
      expect(fields[0].label).toBe("First");
      expect(fields[1].ord).toBe(2);
      expect(fields[1].label).toBe("Second");
      expect(fields[2].ord).toBe(3);
      expect(fields[2].label).toBe("Third");
    });

    test("should return 404 for non-existent form", async () => {
      const response = await request(app).get("/forms/non-existent-id").expect(404);

      expect(response.body.ok).toBe(false);
      expect(response.body.error.code).toBe("NOT_FOUND");
      expect(response.body.error.message).toBeDefined();
    });
  });
});
