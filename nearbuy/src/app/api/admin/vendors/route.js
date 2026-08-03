import adminController from "@/controllers/adminController";
import { verifyAdmin } from "@/middleware/adminAuth";
import { withErrorHandler } from "@/middleware/error.middleware";

export const GET = withErrorHandler(async (req) => {
  await verifyAdmin(req);
  return await adminController.getVendors(req);
});
