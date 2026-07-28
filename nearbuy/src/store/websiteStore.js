import { create } from "zustand";
import toast from "react-hot-toast";

export const useWebsiteStore = create((set) => ({
  stores: [],
  categories: [],
  offers: [],
  collections: [],
  loading: false,

  fetchPublicDirectory: async (city = "") => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append("city", city);

      const [storesRes, categoriesRes, offersRes, collectionsRes] = await Promise.all([
        fetch(`/api/stores?${queryParams}`),
        fetch("/api/categories"),
        fetch("/api/offers"),
        fetch("/api/collections"),
      ]);

      const storesData = await storesRes.json();
      const categoriesData = await categoriesRes.json();
      const offersData = await offersRes.json();
      const collectionsData = await collectionsRes.json();

      set({
        stores: storesData.data?.stores || [],
        categories: categoriesData.data || [],
        offers: offersData.data?.offers || [],
        collections: collectionsData.data?.collections || [],
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  trackConversion: async (eventType, targetId = null, vendorId = null, storeId = null) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, targetId, vendorId, storeId }),
      });
    } catch (error) {
      console.error("Failed to log conversion event:", error);
    }
  },
}));

export default useWebsiteStore;
