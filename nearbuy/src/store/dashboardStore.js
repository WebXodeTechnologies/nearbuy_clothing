import { create } from "zustand";
import toast from "react-hot-toast";

export const useDashboardStore = create((set) => ({
  vendorStats: null,
  adminStats: null,
  loading: false,

  // 1. Vendor Panel Metrics
  fetchVendorStats: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/dashboard/vendor");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch vendor stats");

      set({ vendorStats: data.data || data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  // 2. Admin Command Center Metrics
  fetchAdminStats: async () => {
    set({ loading: true });
    try {
      // Attempt primary admin route
      let res = await fetch("/api/admin/stats");

      // Fallback to legacy dashboard endpoint if route is configured there
      if (!res.ok && res.status === 404) {
        res = await fetch("/api/dashboard/admin");
      }

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch admin metrics");

      set({ adminStats: data.data || data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useDashboardStore;
