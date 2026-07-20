import { create } from "zustand";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  users: [],
  profile: null,
  total: 0,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/users/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      set({ profile: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  updateProfile: async (updateData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ profile: data.data, loading: false });
      toast.success("Profile updated successfully");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  deleteProfile: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/users/profile", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ profile: null, loading: false });
      toast.success("Account profile deleted successfully");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  fetchUsers: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ users: data.data.users, total: data.data.total, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },
}));

export default useUserStore;
