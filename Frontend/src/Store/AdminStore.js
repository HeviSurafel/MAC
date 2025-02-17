import { create } from "zustand";
import axios from "../lib/axios"; // Use the Axios instance
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
    users: [],
    user: null,
    loading: false,
    error: null,
    setUsers: (users) => set({ users }),
    setUser: (user) => set({ user }),
    getAllUsers: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/users");
            set({ users: res.data, loading: false });
        } catch (error) {
            set({ loading: false, error: error });
            toast.error("Failed to load users."+error);
        }
    },
    createUser: async (userData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/users", userData); // Endpoint to create user
            set({ users: [...get().users, res.data], loading: false });
            toast.success("User created successfully.");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },
    deleteUser: async (userId) => {
        try {
            const res = await axios.delete(`/users/${userId}`); // Endpoint to delete user
            set({ users: get().users.filter(user => user._id !== userId) });
            toast.success("User deleted successfully.");
        } catch (error) {
            set({ error: error.message });
            toast.error("Failed to delete user.");
        }
    },
    suspendUser: async (userId) => {
        try {
            const res = await axios.put(`/users/suspend/${userId}`); // Endpoint to suspend user
            set({ users: get().users.map(user => user._id === userId ? { ...user, status: "suspended" } : user) });
            toast.success("User suspended successfully.");
        } catch (error) {
            set({ error: error.message });
            toast.error("Failed to suspend user.");
        }
    },
    getUserById: async (userId) => {
        try {
            const res = await axios.get(`/users/${userId}`); // Endpoint to get a user by ID
            set({ user: res.data });
        } catch (error) {
            set({ error: error.message });
            toast.error("Failed to fetch user details.");
        }
    }
}));

export default useUserStore;
