import logger from "@/lib/logger";

/**
 * Middleware function to log API requests
 * @param {Request} req - Next.js Request object
 */
export function logRequest(req) {
  const method = req.method;
  const url = req.url;
  const startTime = Date.now();

  logger.info(`Incoming Request: ${method} ${url}`);

  return () => {
    const duration = Date.now() - startTime;
    logger.info(`Completed Request: ${method} ${url} in ${duration}ms`);
  };
}

export default logRequest;
