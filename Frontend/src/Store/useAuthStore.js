import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: JSON.parse(localStorage.getItem("user")) || null, // Ensures user is set from localStorage initially
      contacts: null,
      loading: false,
      checkingAuth: false,

      signup: async ({ name, email, password, confirmPassword }) => {
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        set({ loading: true });
        try {
          const { data } = await axios.post("/auth/signup", { name, email, password });
          set({ user: { ...data, expiresAt: Date.now() + EXPIRATION_TIME } });
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
          set({ user: { ...data, expiresAt: Date.now() + EXPIRATION_TIME } });
          localStorage.setItem("user", JSON.stringify({ ...data, expiresAt: Date.now() + EXPIRATION_TIME })); // Persist user in localStorage
          toast.success("Login successful");
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (address, phone) => {
        set({ loading: true });
        try {
          const { data } = await axios.put("/auth/updateprofile", { phone, address });
          set({ user: { ...data, expiresAt: get().user?.expiresAt } });
          toast.success("Profile updated successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Update failed");
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null });
          localStorage.removeItem("user"); // Remove user from localStorage on logout
          toast.success("Logged out successfully");
          window.location.href = "/login";
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          const user = get().user;
          if (user?.expiresAt && Date.now() > user.expiresAt) {
            set({ user: null });
            localStorage.removeItem("user"); // Clear expired user from localStorage
            return;
          }
          const { data } = await axios.get("/auth/profile");
          set({ user: { ...data, expiresAt: Date.now() + EXPIRATION_TIME } });
        } catch {
          set({ user: null });
          localStorage.removeItem("user"); // Ensure localStorage is cleared if an error occurs
        } finally {
          set({ checkingAuth: false });
        }
      },

      resetPassword: async (token, password) => {
        try {
          await axios.put("/auth/updateNewPassword", { token, password });
        } catch (error) {
          toast.error(error.response?.data?.message || "Reset failed");
        }
      },

      updatePassword: async (oldPassword, newpassword, email) => {
        try {
          await axios.put("/auth/update-password", { email, oldPassword, newpassword });
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
          set({ user: { ...data, expiresAt: Date.now() + EXPIRATION_TIME } });
          localStorage.setItem("user", JSON.stringify({ ...data, expiresAt: Date.now() + EXPIRATION_TIME })); // Update localStorage
          return data;
        } catch (error) {
          set({ user: null });
          localStorage.removeItem("user"); // Ensure user is cleared from localStorage on error
          throw error;
        } finally {
          set({ checkingAuth: false });
        }
      },

      contactUs: async (name, email, subject, message) => {
        set({ loading: true, success: false, error: null });

        try {
          const response = await axios.post("/auth/contactUs", {
            name,
            email,
            subject,
            message,
          });

          set({ success: true, loading: false });
          toast.success("Message sent successfully");
          return response.data; // Return response if needed
        } catch (error) {
          set({
            error: error.response?.data?.error || "Something went wrong!",
            loading: false,
          });
        }
      },

      deleteContactUs: async (_id) => {
        try {
          await axios.delete(`/delete/contact/${_id}`);
          toast.success("Message successfully deleted");
        } catch (error) {
          return error.response?.data?.error || "Something went wrong!";
        }
      },

      getContactUs: async () => {
        try {
          const response = await axios.get("/contact");
          set({ contacts: response.data });
          // Return response if needed
        } catch (error) {
          return error.response?.data?.error || "Something went wrong!";
        }
      },

      requestPasswordReset: async (email) => {
        try {
          await axios.post("/auth/resetpassword", { email });
          toast.success("Password reset link sent");
        } catch (error) {
          toast.error(error.response?.data?.message || "Reset failed");
        }
      },
    }),
    {
      name: "user",
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user }), // Persist only the user state
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
