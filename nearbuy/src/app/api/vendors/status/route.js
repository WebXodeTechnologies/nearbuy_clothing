import { requireAdmin } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import vendorRepository from "@/repositories/vendor.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

export const PATCH = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const body = await req.json();
  const { vendorId, status } = body;

  if (!vendorId || !status) {
    throw new ApiError(400, "vendorId and status are required.");
  }

  const vendor = await vendorRepository.updateStatus(vendorId, status);
  if (!vendor) throw new ApiError(404, "Vendor store not found.");

  return ApiResponse.success(
    vendor,
    `Vendor status updated to '${status}' successfully`,
  );
});
