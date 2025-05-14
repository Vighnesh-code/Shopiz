import toast from "react-hot-toast";
import axios from "../lib/axios";
import { create } from "zustand";
import { get } from "mongoose";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password do no match");
    }
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success("Account Created Successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An Error Occurred");
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Logged In Successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An Error Occurred");
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged Out Successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ checkingAuth: false, user: null });
      throw error;
    }
  },
}));
