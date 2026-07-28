import { withErrorHandler } from "@/middleware/error.middleware";
import vendorController from "@/controllers/vendor.controller";

export const GET = withErrorHandler(async (req, context) => {
  return await vendorController.getVendorById(req, context);
});

export const PUT = withErrorHandler(async (req, context) => {
  return await vendorController.updateVendorProfile(req, context);
});
