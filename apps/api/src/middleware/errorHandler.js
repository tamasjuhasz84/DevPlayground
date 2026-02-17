import { ZodError } from "zod";

/**
 * Express error handling middleware
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 */
export function errorHandler(err, req, res, _next) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        })),
      },
    });
  }

  // Determine status code
  const statusCode = err.status || err.statusCode || 500;

  // Determine error code
  const code = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  // Build error response
  const errorResponse = {
    ok: false,
    error: {
      code,
      message: err.message || "An error occurred",
    },
  };

  // Add details if present
  if (err.details) {
    errorResponse.error.details = err.details;
  }

  // Log error for 500s
  if (statusCode === 500) {
    console.error("Internal Server Error:", err);
  }

  res.status(statusCode).json(errorResponse);
}
