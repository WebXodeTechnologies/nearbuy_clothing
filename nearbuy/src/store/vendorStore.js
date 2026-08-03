import { create } from "zustand";
import toast from "react-hot-toast";

export const useVendorStore = create((set) => ({
  vendors: [],
  currentVendor: null,
  total: 0,
  loading: false,

  // 1. Vendor Public / Merchant Action: Application Registration
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

  // 2. Fetch Vendors Directory (Supports Admin Queue & Public Listings)
  fetchVendors: async (status = "", page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (status) queryParams.append("status", status);

      // Attempt Admin route first
      let res = await fetch(`/api/admin/vendors?${queryParams}`);

      // Fallback to Public/Vendor API if Admin route returns 404/403
      if (!res.ok) {
        res = await fetch(`/api/vendors?${queryParams}`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch vendors");

      // Handle array or object response structure safely
      const vendorList = Array.isArray(data.data)
        ? data.data
        : data.data?.vendors || [];

      const totalCount = data.data?.total || vendorList.length || 0;

      set({ vendors: vendorList, total: totalCount, loading: false });
      return vendorList;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      return [];
    }
  },

  // 3. Update Vendor Status (Supports Admin Status Route & Legacy Route)
  updateVendorStatus: async (vendorId, status) => {
    set({ loading: true });
    try {
      // 🎯 Primary Admin PATCH Endpoint
      let res = await fetch(`/api/admin/vendors/${vendorId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      // 🔄 Legacy Fallback Endpoint (/api/vendors/status)
      if (!res.ok && res.status === 404) {
        res = await fetch("/api/vendors/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId, status }),
        });
      }

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update vendor status");

      toast.success(`Vendor ${status.toLowerCase()} successfully`);

      set((state) => ({
        vendors: state.vendors.map((v) =>
          v._id === vendorId
            ? { ...v, status, isActive: status.toUpperCase() === "APPROVED" }
            : v,
        ),
        loading: false,
      }));

      return data.data || data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useVendorStore;
