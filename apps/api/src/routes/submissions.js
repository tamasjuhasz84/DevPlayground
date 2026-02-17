import express from "express";
import * as submissionsRepo from "../db/repos/submissionsRepo.js";
import * as formsRepo from "../db/repos/formsRepo.js";
import { CreateSubmissionSchema } from "@dp/shared";

const router = express.Router();

// GET /forms/:formId/submissions - List submissions for a form
router.get("/forms/:formId/submissions", (req, res, next) => {
  try {
    const form = formsRepo.getForm(req.params.formId);

    if (!form) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const submissions = submissionsRepo.listByForm(req.params.formId);

    res.json({
      ok: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
});

// POST /forms/:formId/submissions - Create a new submission
router.post("/forms/:formId/submissions", (req, res, next) => {
  try {
    const validatedData = CreateSubmissionSchema.parse(req.body);

    const form = formsRepo.getForm(req.params.formId);

    if (!form) {
      const error = new Error("Form not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const submission = submissionsRepo.createSubmission(req.params.formId, validatedData.payload);

    res.status(201).json({
      ok: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
});

// GET /submissions/:id - Get a single submission
router.get("/submissions/:id", (req, res, next) => {
  try {
    const submission = submissionsRepo.getSubmission(req.params.id);

    if (!submission) {
      const error = new Error("Submission not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    res.json({
      ok: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
