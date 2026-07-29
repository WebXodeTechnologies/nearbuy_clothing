import { create } from "zustand";

export const useStoreStore = create((set) => ({
  stores: [],
  currentStore: null,
  total: 0,
  loading: false,

  fetchStores: async (filters = {}, page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (typeof filters === "string") {
        if (filters) queryParams.append("city", filters);
      } else if (filters && typeof filters === "object") {
        if (filters.city) queryParams.append("city", filters.city);
        if (filters.vendor) queryParams.append("vendor", filters.vendor);
        if (filters.all) queryParams.append("all", "true");
      }

      const res = await fetch(`/api/stores?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch stores");

      const storeList =
        data.data?.stores || (Array.isArray(data.data) ? data.data : []);
      const totalCount = data.data?.total || storeList.length || 0;

      set({ stores: storeList, total: totalCount, loading: false });
      return storeList;
    } catch (error) {
      set({ loading: false });
      console.error("fetchStores error:", error);
      return [];
    }
  },

  fetchStoreById: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/stores/${id}`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch store details");

      const storeData = data.data || data;
      set({ currentStore: storeData, loading: false });
      return storeData;
    } catch (error) {
      set({ loading: false });
      console.error("fetchStoreById error:", error);
      return null;
    }
  },

  createStore: async (storeData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create store");

      const newStore = data.data || data;
      set((state) => ({ stores: [newStore, ...state.stores], loading: false }));
      return newStore;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateStore: async (id, updateData) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update store");

      const updatedStore = data.data || data;
      set((state) => ({
        stores: state.stores.map((s) => (s._id === id ? updatedStore : s)),
        loading: false,
      }));
      return updatedStore;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteStore: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/stores/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete store");

      set((state) => ({
        stores: state.stores.filter((s) => s._id !== id),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));

export default useStoreStore;
