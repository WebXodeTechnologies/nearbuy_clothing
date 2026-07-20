import ApiError from "@/utils/apiError";

const rateLimitMap = new Map();

/**
 * Basic sliding-window rate limiter for Next.js API route handlers
 * @param {string} key - Unique identifier (e.g., IP address or user ID)
 * @param {number} limit - Maximum allowed requests in window
 * @param {number} windowMs - Time window in milliseconds (default: 60s)
 */
export function rateLimit(key = "global", limit = 100, windowMs = 60 * 1000) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + windowMs;
  } else {
    userRecord.count += 1;
  }

  rateLimitMap.set(key, userRecord);

  if (userRecord.count > limit) {
    throw new ApiError(429, "Too many requests. Please try again later.");
  }

  return {
    remaining: limit - userRecord.count,
    resetInSeconds: Math.ceil((userRecord.resetTime - now) / 1000),
  };
}

export default rateLimit;
