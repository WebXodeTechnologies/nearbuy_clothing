import adminRepository from "@/repositories/adminRepository";
import ApiError from "@/utils/apiError";

class AdminService {
  async getDashboardAnalytics() {
    const stats = await adminRepository.getSystemStats();

    // Chart timeline data for directory trends
    const chartData = [
      { label: "Feb", views: 800, enquiries: 350 },
      { label: "Mar", views: 1200, enquiries: 500 },
      { label: "Apr", views: 1650, enquiries: 720 },
      { label: "May", views: 1400, enquiries: 610 },
      { label: "Jun", views: 2100, enquiries: 890 },
      {
        label: "Jul",
        views: stats.totalStoreViews || 2540,
        enquiries: stats.totalWhatsappClicks || 1120,
      },
    ];

    return {
      ...stats,
      chartData,
    };
  }

  async getVendorsQueue(status) {
    return await adminRepository.findVendorsByStatus(status);
  }

  async processVendorApproval(vendorId, status) {
    const validStatuses = ["Approved", "Rejected", "Pending", "Suspended"];
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!validStatuses.includes(formattedStatus)) {
      throw new ApiError(400, `Invalid vendor status provided: ${status}`);
    }

    const vendor = await adminRepository.updateVendorStatus(
      vendorId,
      formattedStatus,
    );
    if (!vendor) {
      throw new ApiError(404, "Vendor document not found");
    }

    return vendor;
  }
}

export default new AdminService();
