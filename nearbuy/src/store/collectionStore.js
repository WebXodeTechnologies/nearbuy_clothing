import { create } from "zustand";

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
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch collections");

      const collectionsList =
        data.data?.collections || (Array.isArray(data.data) ? data.data : []);
      const totalCount = data.data?.total || collectionsList.length || 0;

      set({
        collections: collectionsList,
        total: totalCount,
        loading: false,
      });

      return collectionsList;
    } catch (error) {
      set({ loading: false });
      console.error("fetchCollections error:", error);
      return [];
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
      if (!res.ok)
        throw new Error(data.message || "Failed to create collection");

      const newCollection = data.data || data;

      set((state) => ({
        collections: [newCollection, ...state.collections],
        loading: false,
      }));

      return newCollection;
    } catch (error) {
      set({ loading: false });
      throw error; // Let UI component catch & trigger single toast
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
      if (!res.ok)
        throw new Error(data.message || "Failed to update collection");

      const updatedCollection = data.data || data;

      set((state) => ({
        collections: state.collections.map((c) =>
          c._id === id ? updatedCollection : c,
        ),
        loading: false,
      }));

      return updatedCollection;
    } catch (error) {
      set({ loading: false });
      throw error; // Let UI component catch & trigger single toast
    }
  },

  deleteCollection: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to delete collection");

      set((state) => ({
        collections: state.collections.filter((c) => c._id !== id),
        loading: false,
      }));

      return true;
    } catch (error) {
      set({ loading: false });
      throw error; // Let UI component catch & trigger single toast
    }
  },
}));

export default useCollectionStore;
