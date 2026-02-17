import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock axios before importing api module
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
    }),
  },
}));

// Import after mocking
const { listForms, createForm, getForm, saveFormSchema } = await import("./api.js");

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listForms", () => {
    test("should unwrap successful response", async () => {
      const mockForms = [
        { id: "1", name: "Form 1" },
        { id: "2", name: "Form 2" },
      ];

      mockGet.mockResolvedValue({
        data: { ok: true, data: mockForms },
      });

      const result = await listForms();
      expect(result).toEqual(mockForms);
      expect(mockGet).toHaveBeenCalledWith("/forms");
    });

    test("should throw error with message from error response", async () => {
      const errorMessage = "Failed to fetch forms";

      mockGet.mockRejectedValue({
        response: {
          data: {
            error: { message: errorMessage },
          },
        },
      });

      await expect(listForms()).rejects.toThrow(errorMessage);
    });

    test("should handle generic error message", async () => {
      mockGet.mockRejectedValue({
        message: "Network Error",
      });

      await expect(listForms()).rejects.toThrow("Network Error");
    });
  });

  describe("createForm", () => {
    test("should send payload and unwrap response", async () => {
      const payload = { name: "New Form", description: "Test" };
      const mockResponse = { id: "123", ...payload };

      mockPost.mockResolvedValue({
        data: { ok: true, data: mockResponse },
      });

      const result = await createForm(payload);
      expect(result).toEqual(mockResponse);
      expect(mockPost).toHaveBeenCalledWith("/forms", payload);
    });
  });

  describe("getForm", () => {
    test("should fetch form by id", async () => {
      const mockForm = {
        id: "123",
        name: "Test Form",
        fields: [],
      };

      mockGet.mockResolvedValue({
        data: { ok: true, data: mockForm },
      });

      const result = await getForm("123");
      expect(result).toEqual(mockForm);
      expect(mockGet).toHaveBeenCalledWith("/forms/123");
    });
  });

  describe("saveFormSchema", () => {
    test("should save form schema", async () => {
      const formId = "123";
      const schema = {
        name: "Updated Form",
        fields: [{ type: "text", name: "field1", ord: 1 }],
      };
      const mockResponse = { ...schema, id: formId };

      mockPut.mockResolvedValue({
        data: { ok: true, data: mockResponse },
      });

      const result = await saveFormSchema(formId, schema);
      expect(result).toEqual(mockResponse);
      expect(mockPut).toHaveBeenCalledWith("/forms/123/schema", schema);
    });
  });
});
