import express from "express";
import cors from "cors";
import { HealthSchema, nowIso } from "@dp/shared";
import formsRouter from "./routes/forms.js";
import submissionsRouter from "./routes/submissions.js";
import { errorHandler } from "./middleware/errorHandler.js";

/**
 * Create and configure Express app
 * @returns {express.Application}
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    const data = { service: "api", time: nowIso() };
    const parsed = HealthSchema.safeParse(data);
    if (!parsed.success) {
      return res.status(500).json({
        ok: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid health payload",
        },
      });
    }
    res.json({ ok: true, data });
  });

  // Mount routers
  app.use("/forms", formsRouter);
  app.use("/forms", submissionsRouter); // For /:formId/submissions routes
  app.use("/", submissionsRouter); // For /submissions/:id route

  // Error handler
  app.use(errorHandler);

  return app;
}
