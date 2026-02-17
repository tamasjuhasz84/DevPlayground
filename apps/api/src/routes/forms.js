import express from "express";
import * as formsRepo from "../db/repos/formsRepo.js";
import { CreateFormSchema, UpdateFormSchema, UpsertFormSchema } from "@dp/shared";

const router = express.Router();

// GET /forms - List all forms
router.get("/", (req, res, next) => {
  try {
    const forms = formsRepo.listForms();

    res.json({
      ok: true,
      data: forms,
    });
  } catch (error) {
    next(error);
  }
});

// POST /forms - Create a new form
router.post("/", (req, res, next) => {
  try {
    const validatedData = CreateFormSchema.parse(req.body);

    const form = formsRepo.createForm(validatedData);

    res.status(201).json({
      ok: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
});

// GET /forms/:id - Get a single form with fields
router.get("/:id", (req, res, next) => {
  try {
    const form = formsRepo.getForm(req.params.id);

    if (!form) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    res.json({
      ok: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /forms/:id - Update form basic fields
router.put("/:id", (req, res, next) => {
  try {
    const validatedData = UpdateFormSchema.parse(req.body);

    const form = formsRepo.updateForm(req.params.id, validatedData);

    if (!form) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    res.json({
      ok: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /forms/:id/schema - Replace form schema (form + fields)
router.put("/:id/schema", (req, res, next) => {
  try {
    const validatedData = UpsertFormSchema.parse(req.body);

    const updatedForm = formsRepo.replaceSchema(req.params.id, validatedData);

    if (!updatedForm) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    res.json({
      ok: true,
      data: updatedForm,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /forms/:id - Delete form and cascade delete fields and submissions
router.delete("/:id", (req, res, next) => {
  try {
    const deleted = formsRepo.deleteForm(req.params.id);

    if (!deleted) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    res.json({
      ok: true,
      data: { id: req.params.id, deleted: true },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
