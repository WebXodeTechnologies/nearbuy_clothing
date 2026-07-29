import { withErrorHandler } from "@/middleware/error.middleware";
import analyticsController from "@/controllers/analytics.controller";

export const GET = withErrorHandler(async (req) => {
  return await analyticsController.getVendorMetrics(req);
});
