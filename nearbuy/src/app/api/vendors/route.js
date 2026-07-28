import { withErrorHandler } from "@/middleware/error.middleware";
import vendorController from "@/controllers/vendor.controller";

export const POST = withErrorHandler(async (req) => {
  return await vendorController.registerVendor(req);
});

export const GET = withErrorHandler(async (req) => {
  return await vendorController.getVendors(req);
});
