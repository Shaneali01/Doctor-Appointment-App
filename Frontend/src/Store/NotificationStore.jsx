import { create } from "zustand";
import { axiosInstance } from "../Lib/axios";
import toast from "react-hot-toast";

const useNotificationStore = create((set) => ({
  notifications: [],
  fetchNotifications: async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/get-notifications/${userId}`);
      set({ notifications: response.data || [] });
    } catch (err) {
      toast.error("Failed to fetch notifications");
      console.error("Notifications fetch error:", err);
      set({
        notifications: [
          { id: 1, message: "Appointment confirmed for tomorrow at 10 AM", timestamp: new Date().toISOString() },
          { id: 2, message: "Dr. Smith updated availability", timestamp: new Date().toISOString() },
        ],
      });
    }
  },
  clearNotifications: async (userId) => {
    try {
      await axiosInstance.delete(`/notifications/${userId}`);
      set({ notifications: [] });
      toast.success("Notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
      console.error("Clear notifications error:", err);
    }
  },
}));

export default useNotificationStore;