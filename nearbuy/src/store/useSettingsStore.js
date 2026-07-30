import { create } from "zustand";
import toast from "react-hot-toast";

export const useSettingsStore = create((set) => ({
  user: null,
  notifications: {
    emailLeads: true,
    whatsappAlerts: true,
    promoReminders: true,
    monthlyReports: false,
  },
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load settings");

      set({
        user: data.data.user,
        notifications: data.data.notifications || {},
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/settings?action=profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ user: data.data, loading: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  updatePassword: async (passwordData) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/settings?action=password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ loading: false });
      toast.success("Password changed successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  updateNotifications: async (notifData) => {
    set({ notifications: notifData });
    try {
      const res = await fetch("/api/settings?action=notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error(error.message);
    }
  },
}));

export default useSettingsStore;
