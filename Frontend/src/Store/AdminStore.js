import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAdminStore = create((set, get) => ({
  users: [],
  feedbacks:null,
  courses: [],
  instructors: [],
  user: null,
  loading: false,
  error: null,

  setUsers: (users) => set({ users }),
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setInstructors: (instructors) => set({ instructors }),

  handleRequest: async (request, successMessage, errorMessage, callback) => {
    set({ loading: true });
    try {
      const response = await request();
      set({ loading: false });
      if (callback) callback(response.data);
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || errorMessage);
      throw error;
    }
  },

  getAllUsers: () =>
    get().handleRequest(
      () => axios.get("/users"),
      null,
      "Failed to load users.",
      (data) => set({ users: data })
    ),

  createUser: (userData) =>
    get().handleRequest(
      () => axios.post("/users", userData),
      "User created successfully.",
      "Failed to create user.",
      (data) => set({ users: [...get().users, data] })
    ),

  deleteUser: (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    get().handleRequest(
      () => axios.delete(`/users/${userId}`),
      "User deleted successfully.",
      "Failed to delete user.",
      () => set({ users: get().users.filter((user) => user._id !== userId) })
    );
  },

  suspendUser: (userId) =>
    get().handleRequest(
      () => axios.put(`/users/suspend/${userId}`),
      "User suspended successfully.",
      "Failed to suspend user.",
      () => set({ users: get().users.map((user) => (user._id === userId ? { ...user, status: "suspended" } : user)) })
    ),

  getUserById: (userId) =>
    get().handleRequest(
      () => axios.get(`/users/${userId}`),
      null,
      "Failed to fetch user details.",
      (data) => set({ user: data })
    ),

    getCourses: (courseId = "", section = "") =>
      get().handleRequest(
        () =>
          axios.get("/courses", {
            params: { courseId, section }, // ✅ Send query parameters correctly
          }),
        null,
        "Failed to fetch courses.",
        (data) => set({ courses: data })
      ),
   
  createCourse: (courseData) =>
    get().handleRequest(
      () => axios.post("/courses", courseData),
      "Course created successfully.",
      "Failed to create course.",
      (data) => set({ courses: [...get().courses, data] })
    ),

  updateCourse: (id, courseData) => {
    if (!window.confirm("Are you sure you want to update this course?")) return;
    get().handleRequest(
      () => axios.put(`/courses/${id}`, courseData),
      "Course updated successfully.",
      "Failed to update course.",
      (data) => set({ courses: get().courses.map((course) => (course._id === id ? data : course)) })
    );
  },

  deleteCourse: (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    get().handleRequest(
      () => axios.delete(`/courses/${id}`),
      "Course deleted successfully.",
      "Failed to delete course.",
      () => set({ courses: get().courses.filter((course) => course._id !== id) })
    );
  },
  fetchFeedbacks: async () => {
    try {
      const response = await axios.get("/student/feedback");
      set({ feedbacks: response.data }); // ✅ Ensure you're setting the actual data
      toast.success("Feedback fetched successfully"); // ✅ Ensure toast message is a string
    } catch (error) {
      toast.error("Failed to fetch feedback.");
    }
  },

  getAllInstructors: () =>
    get().handleRequest(
      () => axios.get("/instructors"),
      null,
      "Failed to fetch instructors.",
      (data) => set({ instructors: data })
    ),

  createInstructor: (instructorData) =>
    get().handleRequest(
      () => axios.post("/instructors", instructorData),
      "Instructor created successfully.",
      "Failed to create instructor.",
      (data) => set({ instructors: [...get().instructors, data] })
    ),

  deleteInstructor: (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;
    get().handleRequest(
      () => axios.delete(`/instructors/${id}`),
      "Instructor deleted successfully.",
      "Failed to delete instructor.",
      () => set({ instructors: get().instructors.filter((inst) => inst._id !== id) })
    );
  },
}));

export default useAdminStore;