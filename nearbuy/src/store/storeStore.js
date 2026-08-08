import { create } from "zustand";

export const useStoreStore = create((set, get) => ({
  stores: [],
  currentStore: null,
  total: 0,
  loading: false,
  error: null,

  // 1. Fetch Current Vendor Store Profile (/api/vendors/me)
  // 1. Fetch Stores (Supports admin full listing or vendor profile)
  fetchStores: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      // 🛠️ FIX: If admin requests all stores, hit the admin endpoint directly
      if (filters && filters.all) {
        const adminRes = await fetch("/api/admin/stores");
        const adminData = await adminRes.json();

        if (!adminRes.ok) {
          throw new Error(
            adminData.message || "Failed to fetch admin stores directory",
          );
        }

        const storeList = adminData.data?.stores || adminData.stores || [];
        set({
          stores: storeList,
          total: storeList.length,
          loading: false,
        });
        return storeList;
      }

      // Otherwise, fetch the single vendor profile / marketplace listings
      const res = await fetch("/api/vendors/me");
      const data = await res.json();

      if (!res.ok) {
        if (filters && filters.city) {
          const queryParams = new URLSearchParams(filters).toString();
          const publicRes = await fetch(`/api/stores?${queryParams}`);
          const publicData = await publicRes.json();
          if (!publicRes.ok) {
            throw new Error(publicData.message || "Failed to fetch stores");
          }

          const storeList =
            publicData.data?.stores ||
            (Array.isArray(publicData.data) ? publicData.data : []);
          set({
            stores: storeList,
            total: publicData.data?.total || storeList.length,
            loading: false,
          });
          return storeList;
        }
        throw new Error(data.message || "Failed to fetch vendor store profile");
      }

      const vendorStore = data.data || data;
      const storeList = vendorStore ? [vendorStore] : [];

      set({
        stores: storeList,
        currentStore: vendorStore,
        total: storeList.length,
        loading: false,
      });

      return storeList;
    } catch (error) {
      console.error("fetchStores error:", error);
      set({ loading: false, error: error.message });
      return [];
    }
  },
  // 2. Fetch Store Details By ID
  fetchStoreById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/vendors/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch store details");
      }

      const storeData = data.data || data;
      set({ currentStore: storeData, loading: false });
      return storeData;
    } catch (error) {
      console.error("fetchStoreById error:", error);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  // 3. Create Vendor Store Profile (/api/vendors/me)
  createStore: async (storeData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/vendors/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create store profile");
      }

      const newStore = data.data || data;
      set((state) => ({
        stores: [newStore, ...state.stores],
        currentStore: newStore,
        loading: false,
      }));
      return newStore;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 4. Update Active Vendor Store Profile (/api/vendors/me)
  updateStore: async (storeId, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/vendors/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update store profile");
      }

      const updatedStore = data.data || data;

      set((state) => ({
        stores: state.stores.map((s) =>
          s._id === updatedStore._id ? updatedStore : s,
        ),
        currentStore: updatedStore,
        loading: false,
      }));

      return updatedStore;
    } catch (error) {
      console.error("updateStore error:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // 5. Delete Store
  deleteStore: async (id) => {
    set({ loading: true });
    try {
      // FIX: Changed from /api/vendors/${id} to /api/stores/${id}
      const res = await fetch(`/api/stores/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete store outlet");
      }

      set((state) => ({
        stores: state.stores.filter((s) => (s._id || s.id) !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
}));

export default useStoreStore;
