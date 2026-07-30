import { create } from "zustand";
import toast from "react-hot-toast";

export const useSubscriptionStore = create((set) => ({
  subscription: null,
  loading: false,

  fetchSubscription: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/subscriptions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch subscription");

      set({ subscription: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  createSubscription: async (subscriptionData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionData),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to initialize subscription");

      set({ subscription: data.data, loading: false });
      toast.success("Subscription initialized successfully!");
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useSubscriptionStore;
