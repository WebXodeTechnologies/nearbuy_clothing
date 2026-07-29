import ApiError from "@/utils/apiError";
import logger from "@/utils/logger";
import ApiResponse from "@/utils/apiResponse";

/**
 * Higher-order error handling wrapper for Next.js App Router API Routes
 * @param {Function} handler - Async API handler function
 */
export function withErrorHandler(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      logger.error(`API Route Error [${req.method} ${req.url}]:`, error);

      // Explicit Mongoose ValidationError Formatter
      if (error.name === "ValidationError") {
        const errorMessages = Object.keys(error.errors || {}).map(
          (field) => `${field}: ${error.errors[field].message}`,
        );
        const readableMsg =
          errorMessages.length > 0
            ? `Database Validation Failed (${errorMessages.join(", ")})`
            : "Database validation failed.";

        return ApiResponse.error(readableMsg, 400);
      }

      if (error instanceof ApiError) {
        return ApiResponse.error(error.message, error.statusCode, error.errors);
      }

      return ApiError.handle(error);
    }
  };
}

export default withErrorHandler;
