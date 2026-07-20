import userRepository from "@/repositories/user.repository";
import vendorRepository from "@/repositories/vendor.repository";
import storeRepository from "@/repositories/store.repository";
import offerRepository from "@/repositories/offer.repository";
import analyticsService from "./analytics.service";

class DashboardService {
  async getVendorDashboardStats(vendorId) {
    const storesCount = await storeRepository.count({ vendorId });
    const offersCount = await offerRepository.count({ vendorId });
    const activeOffersCount = await offerRepository.count({ vendorId, status: "Active" });
    const metrics = await analyticsService.getVendorMetrics(vendorId);

    return {
      storesCount,
      offersCount,
      activeOffersCount,
      ...metrics,
    };
  }

  async getAdminDashboardStats() {
    const totalUsers = await userRepository.count();
    const totalVendors = await vendorRepository.count();
    const pendingVendors = await vendorRepository.count({ status: "Pending" });
    const approvedVendors = await vendorRepository.count({ status: "Approved" });
    const totalStores = await storeRepository.count();
    const platformMetrics = await analyticsService.getPlatformMetrics();

    return {
      totalUsers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalStores,
      ...platformMetrics,
    };
  }
}

export default new DashboardService();
