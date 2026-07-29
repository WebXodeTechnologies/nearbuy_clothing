import { create } from "zustand";

export const useOfferStore = create((set) => ({
  offers: [],
  total: 0,
  loading: false,

  fetchOffers: async (vendorId = "", page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (vendorId) queryParams.append("vendor", vendorId);

      const res = await fetch(`/api/offers?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch offers");

      // Safely extract offers array regardless of API response wrapper format
      const offersList =
        data.data?.offers || (Array.isArray(data.data) ? data.data : []);
      const totalCount = data.data?.total || offersList.length || 0;

      set({
        offers: offersList,
        total: totalCount,
        loading: false,
      });

      return offersList;
    } catch (error) {
      set({ loading: false });
      console.error("fetchOffers error:", error);
      return [];
    }
  },

  createOffer: async (offerData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create offer");

      const newOffer = data.data || data;

      set((state) => ({
        offers: [newOffer, ...state.offers],
        loading: false,
      }));

      return newOffer;
    } catch (error) {
      set({ loading: false });
      throw error; // Re-throw so UI can handle single toast notification cleanly
    }
  },

  updateOffer: async (id, updateData) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update offer");

      const updatedOffer = data.data || data;

      set((state) => ({
        offers: state.offers.map((o) => (o._id === id ? updatedOffer : o)),
        loading: false,
      }));

      return updatedOffer;
    } catch (error) {
      set({ loading: false });
      throw error; // Re-throw so UI can handle single toast notification cleanly
    }
  },

  deleteOffer: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete offer");

      set((state) => ({
        offers: state.offers.filter((o) => o._id !== id),
        loading: false,
      }));

      return true;
    } catch (error) {
      set({ loading: false });
      throw error; // Re-throw so UI can handle single toast notification cleanly
    }
  },
}));

export default useOfferStore;
