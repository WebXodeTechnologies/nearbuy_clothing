import { create } from "zustand";
import toast from "react-hot-toast";

export const useSupportStore = create((set) => ({
  tickets: [],
  loading: false,

  fetchTickets: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/support/tickets");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");

      set({ tickets: data.data || [], loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
    }
  },

  createTicket: async (ticketPayload) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketPayload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to submit support ticket");

      set((state) => ({
        tickets: [data.data, ...state.tickets],
        loading: false,
      }));

      toast.success(
        `Support Ticket #${data.data.ticketId} submitted successfully!`,
      );
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));

export default useSupportStore;
