import { create } from "zustand";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
  stats: null,
  pendingVendors: [],
  loading: false,

  fetchAdminDashboard: async () => {
    set({ loading: true });
    try {
      const statsRes = await fetch("/api/dashboard/admin");
      const statsData = await statsRes.json();
      if (!statsRes.ok) throw new Error(statsData.message);

      const vendorRes = await fetch("/api/vendors?status=Pending");
      const vendorData = await vendorRes.json();
      if (!vendorRes.ok) throw new Error(vendorData.message);

      set({
        stats: statsData.data,
        pendingVendors: vendorData.data.vendors || [],
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  updateVendorStatus: async (vendorId, status) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/vendors/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(`Vendor ${status.toLowerCase()} successfully`);
      set((state) => ({
        pendingVendors: state.pendingVendors.filter((v) => v._id !== vendorId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useAdminStore;
