import { create } from "zustand";
import toast from "react-hot-toast";

export const useWebsiteStore = create((set, get) => ({
  stores: [],
  categories: [],
  offers: [],
  collections: [],
  loading: false,
  hasFetched: false, // Prevents duplicate re-fetching across page navigations

  fetchPublicDirectory: async (city = "", forceRefresh = false) => {
    // Return cached data instantly if already fetched, eliminating the 9s delay on navigation
    if (get().hasFetched && !forceRefresh && get().stores.length > 0) {
      return;
    }

    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append("city", city);

      // OPTIMIZATION: Call a single unified endpoint instead of 4 separate fetches
      const res = await fetch(`/api/public/directory?${queryParams}`);

      if (!res.ok) {
        throw new Error("Failed to load public directory data.");
      }

      const json = await res.json();
      const result = json.data || json;

      set({
        stores: result.stores || [],
        categories: result.categories || [],
        offers: result.offers || [],
        collections: result.collections || [],
        loading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message || "Something went wrong.");
    }
  },

  trackConversion: async (
    eventType,
    targetId = null,
    vendorId = null,
    storeId = null,
  ) => {
    try {
      // Use Beacon API if available for non-blocking analytics tracking
      if (typeof window !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/analytics",
          JSON.stringify({ eventType, targetId, vendorId, storeId }),
        );
        return;
      }

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
