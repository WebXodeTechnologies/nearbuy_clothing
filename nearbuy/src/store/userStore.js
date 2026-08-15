import { create } from "zustand";

const useStoreStore = create((set) => ({
  users: [],
  profile: null,
  stores: [],
  currentStore: null,
  total: 0,
  loading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      let queryStr = "";
      if (typeof params === "object" && params !== null) {
        const queryParams = new URLSearchParams(params).toString();
        queryStr = queryParams ? `?${queryParams}` : "";
      } else {
        queryStr = `?page=${params || 1}&limit=10`;
      }

      const res = await fetch(`/api/users${queryStr}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users directory");
      }

      const usersList =
        data.data?.users ||
        (Array.isArray(data.data) ? data.data : null) ||
        data.users ||
        [];

      const totalCount =
        data.data?.pagination?.total ||
        data.data?.total ||
        data.total ||
        usersList.length;

      set({ users: usersList, total: totalCount, loading: false });
      return { users: usersList, total: totalCount };
    } catch (error) {
      console.error("fetchUsers store error:", error);
      set({ loading: false, error: error.message });
      return { users: [], total: 0 };
    }
  },

  // 1. Fetch Stores Directory (Supports admin full listing or public query filters)
  fetchStores: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      let queryStr = "";
      if (typeof params === "object" && params !== null) {
        const queryParams = new URLSearchParams(params).toString();
        queryStr = queryParams ? `?${queryParams}` : "";
      } else {
        queryStr = `?page=${params || 1}&limit=10`;
      }

      const endpoint = params.all
        ? "/api/admin/stores"
        : `/api/stores${queryStr}`;
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch stores directory");
      }

      const storesList =
        data.data?.stores ||
        (Array.isArray(data.data) ? data.data : null) ||
        data.stores ||
        [];

      const totalCount =
        data.data?.pagination?.total ||
        data.data?.total ||
        data.total ||
        storesList.length;

      set({ stores: storesList, total: totalCount, loading: false });
      return { stores: storesList, total: totalCount };
    } catch (error) {
      console.error("fetchStores store error:", error);
      set({ loading: false, error: error.message });
      return { stores: [], total: 0 };
    }
  },

  // 2. Update Store Details (Status, Featured, etc.)
  updateStore: async (id, updateData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update store");
      }

      const updatedStore = data.data || data;

      set((state) => ({
        stores: state.stores.map((s) =>
          s._id === id || s.id === id ? { ...s, ...updatedStore } : s,
        ),
        loading: false,
      }));

      return updatedStore;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 3. Delete Store Permanently
  deleteStore: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete store");
      }

      set((state) => ({
        stores: state.stores.filter((s) => s._id !== id && s.id !== id),
        loading: false,
      }));

      return true;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 4. Fetch User Profile
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      const profileData = data.data || data;
      set({ profile: profileData, loading: false });
      return profileData;
    } catch (error) {
      console.error("fetchProfile store error:", error);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  // 5. Update User Profile
  updateProfile: async (updateData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updated = data.data || data;
      set({ profile: updated, loading: false });
      return updated;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 6. Delete User Profile
  deleteProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/profile", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete profile");
      }

      set({ profile: null, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default useStoreStore;
