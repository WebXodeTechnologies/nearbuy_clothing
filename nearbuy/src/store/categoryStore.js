import { create } from "zustand";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ categories: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  createCategory: async (categoryData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({ categories: [...state.categories, data.data], loading: false }));
      toast.success("Category created!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useCategoryStore;
