import adminController from "@/controllers/admin.controller";
import { verifyAdmin } from "@/middleware/adminAuth";
import { withErrorHandler } from "@/middleware/error.middleware";

export const PATCH = withErrorHandler(async (req, context) => {
  await verifyAdmin(req);
  return await adminController.updateVendorStatus(req, context);
});
