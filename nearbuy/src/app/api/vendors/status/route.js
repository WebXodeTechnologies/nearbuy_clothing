import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateVendorStatusSchema } from "@/validations/vendor.schema";
import vendorService from "@/services/vendor.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const PUT = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const body = await req.json();
  const { vendorId, status } = body;

  validate(updateVendorStatusSchema, { status });

  const vendor = await vendorService.updateStatus(vendorId, status);
  return ApiResponse.success(vendor, `Vendor status updated to '${status}' successfully`);
});
