import { create } from "zustand";
import { signIn, signOut, getSession } from "next-auth/react";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  fetchSession: async () => {
    set({ loading: true });
    try {
      const session = await getSession();
      set({ user: session?.user || null, loading: false });
      return session?.user;
    } catch (error) {
      set({ user: null, loading: false, error: error.message });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error || "Login failed");
      }

      const freshSession = await getSession();
      set({ user: freshSession?.user || null, loading: false });
      toast.success("Welcome back!");
      return freshSession?.user;
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error(error.message);
      throw error;
    }
  },

  register: async (name, email, password, phone, role) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error || "Login failed after registration");
      }

      const freshSession = await getSession();
      set({ user: freshSession?.user || data.data, loading: false });
      toast.success("Account created successfully!");
      return freshSession?.user || data.data;
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error(error.message);
      throw error;
    }
  },

  loginWithGoogle: async (role = "VENDOR") => {
    try {
      await signIn("google", { callbackUrl: `/auth/callback?role=${role}` });
    } catch (error) {
      toast.error("Google Sign-in failed");
    }
  },

  logout: async () => {
    try {
      await signOut({ redirect: false });
      set({ user: null, loading: false });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  },
}));

export default useAuthStore;
