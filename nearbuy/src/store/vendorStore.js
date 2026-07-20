import { create } from "zustand";
import toast from "react-hot-toast";

export const useVendorStore = create((set) => ({
  vendors: [],
  currentVendor: null,
  total: 0,
  loading: false,

  registerVendor: async (vendorData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);

      set({ currentVendor: data.data, loading: false });
      toast.success("Vendor application submitted!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  fetchVendors: async (status = "", page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (status) queryParams.append("status", status);

      const res = await fetch(`/api/vendors?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ vendors: data.data.vendors, total: data.data.total, loading: false });
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
        vendors: state.vendors.map((v) => (v._id === vendorId ? { ...v, status } : v)),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useVendorStore;
