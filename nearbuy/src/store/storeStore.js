import { create } from "zustand";
import toast from "react-hot-toast";

export const useStoreStore = create((set) => ({
  stores: [],
  currentStore: null,
  total: 0,
  loading: false,

  fetchStores: async (city = "", page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (city) queryParams.append("city", city);

      const res = await fetch(`/api/stores?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ stores: data.data.stores, total: data.data.total, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  fetchStoreById: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/stores/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ currentStore: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
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
      if (!res.ok) throw new Error(data.message);

      set((state) => ({ stores: [data.data, ...state.stores], loading: false }));
      toast.success("Store created successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
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
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        stores: state.stores.map((s) => (s._id === id ? data.data : s)),
        loading: false,
      }));
      toast.success("Store updated successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  deleteStore: async (id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/stores/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        stores: state.stores.filter((s) => s._id !== id),
        loading: false,
      }));
      toast.success("Store deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useStoreStore;
