import { create } from "zustand";
import toast from "react-hot-toast";

export const useCMSStore = create((set) => ({
  pages: [],
  currentPage: null,
  loading: false,

  fetchPages: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ pages: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  fetchPageBySlug: async (slug) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/cms/${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ currentPage: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  createPage: async (pageData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({ pages: [...state.pages, data.data], loading: false }));
      toast.success("Page created successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useCMSStore;
