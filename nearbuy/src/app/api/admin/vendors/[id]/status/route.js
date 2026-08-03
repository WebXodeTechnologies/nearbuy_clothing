import adminController from "@/controllers/adminController";
import { verifyAdmin } from "@/middleware/adminAuth";
import { withErrorHandler } from "@/middleware/error.middleware";

export const PATCH = withErrorHandler(async (req, context) => {
  await verifyAdmin(req);
  return await adminController.updateVendorStatus(req, context);
});
