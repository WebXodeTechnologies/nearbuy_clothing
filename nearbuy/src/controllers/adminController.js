import adminService from "@/services/adminService";
import ApiResponse from "@/utils/apiResponse";

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

  async updateVendorStatus(req, { params }) {
    const { id } = params;
    const body = await req.json();
    const updatedVendor = await adminService.processVendorApproval(
      id,
      body.status,
    );
    return ApiResponse.success(
      updatedVendor,
      `Vendor status updated to ${body.status}`,
    );
  }
}

export default new AdminController();
