import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Centralized error logging helper
 * @param {Error} err - Error object
 * @param {Object} context - Logging context
 * @param {string} context.type - Error type identifier
 * @param {string} [context.code] - Error code
 * @param {number} [context.statusCode] - HTTP status code
 */
function logError(err, context) {
  const { type, code, statusCode } = context;

  if (!isDevelopment && statusCode !== 500) {
    // Silent in production for non-500 errors
    return;
  }

  switch (type) {
    case "validation":
      if (isDevelopment) {
        console.error("Validation Error:", err.errors);
      }
      break;

    case "app":
      if (isDevelopment) {
        console.error(`AppError [${code}]:`, err.message);
      }
      break;

    case "unknown":
      if (statusCode === 500) {
        if (isDevelopment) {
          console.error("Internal Server Error:", {
            message: err.message,
            stack: err.stack,
            code,
            statusCode,
          });
        } else {
          console.error(`Internal Server Error: ${err.message}`);
        }
      } else if (isDevelopment) {
        console.error(`Error [${code}]:`, err.message);
      }
      break;
  }
}

/**
 * Express error handling middleware
 * Formats all errors in standard envelope: { ok: false, error: { code, message, details? } }
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 */
export function errorHandler(err, req, res, _next) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logError(err, { type: "validation" });

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

  // Handle known application errors
  if (err instanceof AppError) {
    logError(err, { type: "app", code: err.errorCode });

    const errorResponse = {
      ok: false,
      error: {
        code: err.errorCode,
        message: err.message,
      },
    };

    if (err.details) {
      errorResponse.error.details = err.details;
    }

    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle unknown errors (500)
  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  logError(err, { type: "unknown", code, statusCode });

  // Build generic error response
  const errorResponse = {
    ok: false,
    error: {
      code,
      message:
        statusCode === 500 && !isDevelopment
          ? "An internal server error occurred"
          : err.message || "An error occurred",
    },
  };

  // Only include details in non-500 errors or in development
  if (err.details && (statusCode !== 500 || isDevelopment)) {
    errorResponse.error.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
}
