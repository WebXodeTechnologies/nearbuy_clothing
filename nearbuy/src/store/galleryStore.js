import { create } from "zustand";

export const useGalleryStore = create((set) => ({
  media: [],
  loading: false,

  fetchGallery: async (vendorId) => {
    if (!vendorId) return;
    set({ loading: true });
    try {
      const res = await fetch(`/api/gallery?vendor=${vendorId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch gallery");

      const assets = data.data || [];
      set({ media: assets, loading: false });
      return assets;
    } catch (error) {
      set({ loading: false });
      console.error("fetchGallery error:", error);
      return [];
    }
  },

  createAsset: async (assetData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload photo");

      const newAsset = data.data || data;
      set((state) => ({ media: [newAsset, ...state.media], loading: false }));
      return newAsset;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteAsset: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete photo");

      set((state) => ({
        media: state.media.filter((item) => item._id !== id && item.id !== id),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));

export default useGalleryStore;
