import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: true,

      signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
          set({ loading: false });
          return toast.error("Passwords do not match");
        }

        try {
          const res = await axios.post("/auth/signup", { name, email, password });
          set({ user: res.data, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post("/auth/login", { email, password });
          set({ user: res.data, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null });
          window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred during logout");
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
    
      

      resetPassword: async (email) => {
        try {
          await axios.post("/auth/reset-password", { email });
          toast.success("Password reset link sent to your email.");
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },

      refreshToken: async () => {
        console.log("Refreshing token...");
        if (get().checkingAuth) return;
        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refreshtoken");
            console.log("New access token:", response.data);
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            console.error("Refresh token failed:", error);
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },
    
    }),
    {
      name: "user", // LocalStorage key
      getStorage: () => localStorage, // Use localStorage (or sessionStorage if preferred)
      partialize: (state) => ({ user: state.user }), // Persist only the 'user' field
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
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default useUserStore;
