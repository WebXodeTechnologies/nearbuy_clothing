import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  profile: null,
  total: 0,
  loading: false,
  error: null,

  // 1. Fetch User Profile
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/profile");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }

      const profileData = data.data || data;
      set({ profile: profileData, loading: false });
      return profileData;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error("fetchProfile error:", error);
      return null;
    }
  },

  // 2. Update User Profile
  updateProfile: async (updateData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedProfile = data.data || data;
      set((state) => ({
        profile: { ...state.profile, ...updatedProfile },
        loading: false,
      }));

      return updatedProfile;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 3. Delete Account Profile
  deleteProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users/profile", {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete account profile");
      }

      set({ profile: null, loading: false });
      return true;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // 4. Fetch Users List (Handles both object params and primitive args)
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

      // Safe extraction for all backend pagination formats
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
}));

export default useUserStore;
