import express from "express";
import * as formsRepo from "../db/repos/formsRepo.js";
import { CreateFormSchema, UpdateFormSchema, UpsertFormSchema } from "@dp/shared";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../errors/AppError.js";

const router = express.Router();

/**
 * Maps database form object to clean public DTO
 * Removes internal fields like createdAt, updatedAt, and field IDs
 * @param {Object} form - Raw form object from database
 * @returns {Object} Clean form DTO
 */
function toSchemaDto(form) {
  if (!form) return null;

  return {
    id: form.id,
    name: form.name,
    description: form.description,
    status: form.status,
    fields: (form.fields || []).map((field) => ({
      type: field.type,
      name: field.name,
      label: field.label,
      required: field.required,
      ord: field.ord,
      config: field.config,
    })),
  };
}

// GET /forms - List all forms
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const forms = formsRepo.listForms();

    res.json({
      ok: true,
      data: forms,
    });
  })
);

// POST /forms - Create a new form
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const validatedData = CreateFormSchema.parse(req.body);

    const form = formsRepo.createForm(validatedData);

    res.status(201).json({
      ok: true,
      data: form,
    });
  })
);

// GET /forms/:id - Get a single form with fields
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const form = formsRepo.getForm(req.params.id);

    if (!form) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    res.json({
      ok: true,
      data: form,
    });
  })
);

// PUT /forms/:id - Update form basic fields
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const validatedData = UpdateFormSchema.parse(req.body);

    const form = formsRepo.updateForm(req.params.id, validatedData);

    if (!form) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    res.json({
      ok: true,
      data: form,
    });
  })
);

// PUT /forms/:id/schema - Replace form schema (form + fields)
router.put(
  "/:id/schema",
  asyncHandler(async (req, res) => {
    const validatedData = UpsertFormSchema.parse(req.body);

    const updatedForm = formsRepo.replaceSchema(req.params.id, validatedData);

    if (!updatedForm) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    res.json({
      ok: true,
      data: toSchemaDto(updatedForm),
    });
  })
);

// DELETE /forms/:id - Delete form and cascade delete fields and submissions
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = formsRepo.deleteForm(req.params.id);

    if (!deleted) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    res.json({
      ok: true,
      data: { id: req.params.id, deleted: true },
    });
  })
);

export default router;
