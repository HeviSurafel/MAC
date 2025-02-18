import { create } from "zustand";
import axios from "../lib/axios"; // Use the Axios instance
import { toast } from "react-hot-toast";
const useUserStore = create((set, get) => ({
    users: [],
    courses: [],
    instructor: [], // Add this line
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
        console.log(userData);
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
    },
    createCourse: async (courseData) => {
        console.log(courseData);
        try {
            const res = await axios.post("/courses", courseData); // Endpoint to create course
           set({courses: [...get().courses, res.data]});
            toast.success("Course created successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create course.");
        }
    },
    getCourses: async () => {
        try {
            const res = await axios.get("/courses"); // Endpoint to get all courses
            set({ courses: res.data });
        } catch (error) {
            set({ error: error.message });
            toast.error("Failed to fetch courses.");
        }
    },
    deleteCourse: async (id) => {   
        try {
            const res = await axios.delete(`/courses/${id}`); // Endpoint to delete course
            set({ courses: get().courses.filter(course => course._id !== id) });
            toast.success("Course deleted successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete course.");
        }
    },
    updateCourse: async (id, courseData) => {
        try {
            const res = await axios.put(`/courses/${id}`, courseData); // Endpoint to update course
            set({ courses: get().courses.map(course => course._id === id ? res.data : course) });
            toast.success("Course updated successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update course.");
        }
    },
    createInstractor: async ({firstName, lastName, email, password, department}) => {
        try {
            const res = await axios.post("/instructors", {firstName, lastName, email, password, department}); // Endpoint to create instructor
            set({instructor: [...get().instructor, res.data]});
            toast.success("Instructor created successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create instructor.");
        }
    },
    getAllInstructors: async () => {
        try {
            const res = await axios.get("/instructors"); // Endpoint to get all instructors
            set({ instructor: res.data });
           
        } catch (error) {
            set({ error: error.message });
            toast.error("Failed to fetch instructors.");
        }
    },
    deleteInstructor: async (id) => {
        try {
            const res = await axios.delete(`/instructors/${id}`);
            set({ instructor: get().instructor.filter(instructor => instructor._id !== id) });
            toast.success("Instructor deleted successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete instructor.");
        }   }
}));

export default useUserStore;
