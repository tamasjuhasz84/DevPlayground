import express from "express";
import * as submissionsRepo from "../db/repos/submissionsRepo.js";
import * as formsRepo from "../db/repos/formsRepo.js";
import { CreateSubmissionSchema } from "@dp/shared";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../errors/AppError.js";

const router = express.Router();

// GET /:formId/submissions - List submissions for a form (mounted under /forms)
router.get(
  "/:formId/submissions",
  asyncHandler(async (req, res) => {
    const form = await formsRepo.getForm(req.params.formId);

    if (!form) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    const submissions = await submissionsRepo.listByForm(req.params.formId);

    res.json({
      ok: true,
      data: submissions,
    });
  })
);

// POST /:formId/submissions - Create a new submission (mounted under /forms)
router.post(
  "/:formId/submissions",
  asyncHandler(async (req, res) => {
    const validatedData = CreateSubmissionSchema.parse(req.body);

    const form = await formsRepo.getForm(req.params.formId);

    if (!form) {
      throw new AppError("Form not found", 404, "NOT_FOUND");
    }

    const submission = await submissionsRepo.createSubmission(
      req.params.formId,
      validatedData.payload
    );

    res.status(201).json({
      ok: true,
      data: submission,
    });
  })
);

// GET /submissions/:id - Get a single submission (mounted under /)
router.get(
  "/submissions/:id",
  asyncHandler(async (req, res) => {
    const submission = await submissionsRepo.getSubmission(req.params.id);

    if (!submission) {
      throw new AppError("Submission not found", 404, "NOT_FOUND");
    }

    res.json({
      ok: true,
      data: submission,
    });
  })
);

export default router;
