import { create } from "zustand";
import toast from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch notifications");

      set({ notifications: data.data || [], loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  markAllRead: async () => {
    // Optimistic Update
    const previous = get().notifications;
    set({
      notifications: previous.map((n) => ({ ...n, unread: false })),
    });

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("All notifications marked as read.");
    } catch (error) {
      set({ notifications: previous }); // Rollback
      toast.error(error.message);
    }
  },

  markSingleRead: async (id) => {
    const previous = get().notifications;
    set({
      notifications: previous.map((n) =>
        n._id === id ? { ...n, unread: false } : n,
      ),
    });

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    } catch (error) {
      set({ notifications: previous }); // Rollback
    }
  },
}));

export default useNotificationStore;
