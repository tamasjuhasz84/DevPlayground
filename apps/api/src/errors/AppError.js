/**
 * Custom application error class for known errors
 * Use this instead of throwing raw Error objects for better error handling
 */
export class AppError extends Error {
  constructor(message, statusCode = 400, errorCode = "APP_ERROR", details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
