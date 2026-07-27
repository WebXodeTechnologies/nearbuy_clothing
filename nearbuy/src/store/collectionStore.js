import { create } from "zustand";
import toast from "react-hot-toast";

export const useCollectionStore = create((set) => ({
  collections: [],
  total: 0,
  loading: false,

  fetchCollections: async (filters = {}, page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (filters.vendor) queryParams.append("vendor", filters.vendor);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.all) queryParams.append("all", "true");

      const res = await fetch(`/api/collections?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        collections: data.data.collections || [],
        total: data.data.total || 0,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  createCollection: async (collectionData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        collections: [data.data, ...state.collections],
        loading: false,
      }));
      toast.success("Lookbook published successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  updateCollection: async (id, updateData) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        collections: state.collections.map((c) => (c._id === id ? data.data : c)),
        loading: false,
      }));
      toast.success("Lookbook updated successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  deleteCollection: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        collections: state.collections.filter((c) => c._id !== id),
        loading: false,
      }));
      toast.success("Lookbook deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useCollectionStore;
