import ApiError from "@/utils/apiError";
import logger from "@/lib/logger";

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
      return ApiError.handle(error);
    }
  };
}

export default withErrorHandler;
