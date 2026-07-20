import { create } from "zustand";
import toast from "react-hot-toast";

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
      if (!res.ok) throw new Error(data.message);

      set({ offers: data.data.offers, total: data.data.total || 0, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
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
      if (!res.ok) throw new Error(data.message);

      set((state) => ({ offers: [data.data, ...state.offers], loading: false }));
      toast.success("Offer created successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  deleteOffer: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        offers: state.offers.filter((o) => o._id !== id),
        loading: false,
      }));
      toast.success("Offer deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useOfferStore;
