import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import vendorService from "@/services/vendor.service";
import dashboardService from "@/services/dashboard.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  let vendor = null;
  try {
    vendor = await vendorService.getVendorByOwner(user.id);
  } catch {
    // Account is VENDOR role, but hasn't created a business profile document yet
  }

  const stats = await dashboardService.getVendorDashboardStats(vendor ? vendor._id : null);

  return ApiResponse.success(stats, "Vendor dashboard stats retrieved successfully");
});
