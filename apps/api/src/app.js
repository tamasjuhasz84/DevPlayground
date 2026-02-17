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
    const payload = { ok: true, service: "api", time: nowIso() };
    const parsed = HealthSchema.safeParse(payload);
    if (!parsed.success)
      return res.status(500).json({ ok: false, error: "Invalid health payload" });
    res.json(payload);
  });

  // Mount routers
  app.use("/forms", formsRouter);
  app.use("/", submissionsRouter);

  // Error handler
  app.use(errorHandler);

  return app;
}
