import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: false,

      signup: async ({ name, email, password, confirmPassword }) => {
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        set({ loading: true });
        try {
          const { data } = await axios.post("/auth/signup", { name, email, password });
          set({ user: data });
          toast.success("Signup successful");
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed");
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await axios.post("/auth/login", { email, password });
          set({ user: data });
          toast.success("Login successful");
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null });
          toast.success("Logged out successfully");
          window.location.href = "/login";
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          const { data } = await axios.get("/auth/profile");
          set({ user: data });
        } catch {
          set({ user: null });
        } finally {
          set({ checkingAuth: false });
        }
      },

      resetPassword: async (email) => {
        try {
          await axios.post("/auth/reset-password", { email });
          toast.success("Password reset link sent");
        } catch (error) {
          toast.error(error.response?.data?.message || "Reset failed");
        }
      },
      updatePassword: async (oldPassword,newpassword,email) => {
        try {
          await axios.put("/auth/update-password", { email,oldPassword,newpassword });
          toast.success("Password updated");
        } catch (error) {
          toast.error(error.response?.data?.message || "Update failed");
        }
      },

      refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
          const { data } = await axios.post("/auth/refreshtoken");
          return data;
        } catch (error) {
          set({ user: null });
          throw error;
        } finally {
          set({ checkingAuth: false });
        }
      },
    }),
    {
      name: "user",
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Axios interceptor for token refresh
let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch {
        useUserStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default useUserStore;