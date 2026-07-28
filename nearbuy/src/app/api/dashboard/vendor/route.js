import { withErrorHandler } from "@/middleware/error.middleware";
import dashboardController from "@/controllers/dashboard.controller";

export const GET = withErrorHandler(async (req) => {
  return await dashboardController.getVendorStats(req);
});
