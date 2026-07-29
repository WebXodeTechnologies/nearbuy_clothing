import { withErrorHandler } from "@/middleware/error.middleware";
import analyticsController from "@/controllers/analytics.controller";

export const POST = withErrorHandler(async (req) => {
  return await analyticsController.trackEvent(req);
});
