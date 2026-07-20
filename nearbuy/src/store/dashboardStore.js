import { create } from "zustand";
import toast from "react-hot-toast";

export const useDashboardStore = create((set) => ({
  vendorStats: null,
  adminStats: null,
  loading: false,

  fetchVendorStats: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/dashboard/vendor");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ vendorStats: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  fetchAdminStats: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/dashboard/admin");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ adminStats: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useDashboardStore;
