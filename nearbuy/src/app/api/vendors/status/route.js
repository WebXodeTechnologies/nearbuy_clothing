import { withErrorHandler } from "@/middleware/error.middleware";
import vendorController from "@/controllers/vendor.controller";

export const PUT = withErrorHandler(async (req) => {
  return await vendorController.updateStatus(req);
});
