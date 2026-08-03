import adminService from "@/services/adminService";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";

class AdminController {
  async getStats(req) {
    const analytics = await adminService.getDashboardAnalytics();
    return ApiResponse.success(
      analytics,
      "Admin metrics retrieved successfully",
    );
  }

  async getVendors(req) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const vendors = await adminService.getVendorsQueue(status);
    return ApiResponse.success(vendors, "Vendors retrieved successfully");
  }

  // FIXED: Removed 'function' keyword inside class scope & added proper async handling
  async updateVendorStatus(req, { params }) {
    const { id } = await params;
    await dbConnect();

    const body = await req.json();
    const { status } = body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!vendor) {
      throw new ApiError(404, "Vendor document not found");
    }

    return ApiResponse.success(vendor, "Vendor status updated successfully");
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AdminController();
