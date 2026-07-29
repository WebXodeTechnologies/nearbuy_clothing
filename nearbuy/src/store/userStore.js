import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  profile: null,
  total: 0,
  loading: false,

  // 1. Fetch User Profile
  fetchProfile: async () => {
    set({ loading: true });
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
      set({ loading: false });
      console.error("fetchProfile error:", error);
      return null;
    }
  },

  // 2. Update User Profile (Toast removed to prevent duplicate popups)
  updateProfile: async (updateData) => {
    set({ loading: true });
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
      set({ loading: false });
      throw error; // Let component handle toast.error
    }
  },

  // 3. Delete Account Profile
  deleteProfile: async () => {
    set({ loading: true });
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
      set({ loading: false });
      throw error;
    }
  },

  // 4. Fetch Users List
  fetchUsers: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users directory");
      }

      const usersList = data.data?.users || data.users || [];
      const totalCount = data.data?.total || data.total || 0;

      set({ users: usersList, total: totalCount, loading: false });
      return { users: usersList, total: totalCount };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));

export default useUserStore;
