import { requireAdmin } from "@/middleware/admin.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import vendorService from "@/services/vendor.service";
import dashboardService from "@/services/dashboard.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class DashboardController {
  async getAdminStats(req) {
    await requireAdmin(req);
    await dbConnect();

    const stats = await dashboardService.getAdminDashboardStats();
    return ApiResponse.success(
      stats,
      "Admin dashboard stats retrieved successfully",
    );
  }

  async getVendorStats(req) {
    const user = await requireVendor(req);
    await dbConnect();

    let vendor = null;
    try {
      vendor = await vendorService.getVendorByOwner(user.id);
    } catch {
      // Account is VENDOR role, but hasn't created a business profile document yet
    }

    const stats = await dashboardService.getVendorDashboardStats(
      vendor ? vendor._id : null,
    );

    return ApiResponse.success(
      stats,
      "Vendor dashboard stats retrieved successfully",
    );
  }
}

const dashboardController = new DashboardController();
export default dashboardController;
