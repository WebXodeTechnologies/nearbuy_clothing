import { requireAdmin } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import vendorRepository from "@/repositories/vendor.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

export const POST = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const { vendorId, reason } = await req.json();
  if (!vendorId) throw new ApiError(400, "Vendor ID is required.");

  const vendor = await vendorRepository.updateStatus(vendorId, "REJECTED");
  if (!vendor) throw new ApiError(404, "Vendor not found.");

  return ApiResponse.success(
    { vendor, reason: reason || "Application rejected by administrator." },
    "Vendor rejected successfully",
  );
});
