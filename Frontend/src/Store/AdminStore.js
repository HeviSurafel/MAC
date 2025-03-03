import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useAdminStore = create((set, get) => ({
  users: [],
  unpaidStudents: [],
  feedbacks: null,
  courses: [],
  instructors: [],
  user: null,
  loading: false,
  error: null,
  studentPayments: {}, // ✅ New variable to store payment details for each student

  // Setters
  setUnpaidStudents: (students) => set({ unpaidStudents: students }),
  setUsers: (users) => set({ users }),
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setInstructors: (instructors) => set({ instructors }),

  // Helper function to handle API requests
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

  // Fetch all users
  getAllUsers: () =>
    get().handleRequest(
      () => axios.get("/users"),
      null,
      "Failed to load users.",
      (data) => set({ users: data })
    ),

  // Create a new user
  createUser: (userData) =>
    get().handleRequest(
      () => axios.post("/users", userData),
      "User created successfully.",
      "Failed to create user.",
      (data) => set({ users: [...get().users, data] }) // Update users list
    ),

  // Delete a user
  deleteUser: (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    get().handleRequest(
      () => axios.delete(`/users/${userId}`),
      "User deleted successfully.",
      "Failed to delete user.",
      () => set({ users: get().users.filter((user) => user._id !== userId) }) // Remove user from list
    );
  },

  // Suspend a user
  suspendUser: (userId) =>
    get().handleRequest(
      () => axios.put(`/users/suspend/${userId}`),
      "User suspended successfully.",
      "Failed to suspend user.",
      () =>
        set({
          users: get().users.map((user) =>
            user._id === userId ? { ...user, status: "suspended" } : user
          ),
        }) // Update user status
    ),

  // Fetch user by ID
  getUserById: (userId) =>
    get().handleRequest(
      () => axios.get(`/users/${userId}`),
      null,
      "Failed to fetch user details.",
      (data) => set({ user: data }) // Set the selected user
    ),

  // Fetch courses
  getCourses: (courseId = "", section = "") =>
    get().handleRequest(
      () =>
        axios.get("/courses", {
          params: { courseId, section },
        }),
      null,
      "Failed to fetch courses.",
      (data) => set({ courses: data }) // Update courses list
    ),

  // Create a new course
  createCourse: async (courseData) => {
    const response = await axios.post("/courses", courseData);
    set((state) => ({ courses: [...state.courses, response.data] }));
    return response.data;
  },

  // Update a course
  updateCourse: (id, courseData) => {
    if (!window.confirm("Are you sure you want to update this course?")) return;
    get().handleRequest(
      () => axios.put(`/courses/${id}`, courseData),
      "Course updated successfully.",
      "Failed to update course.",
      (data) =>
        set({
          courses: get().courses.map((course) =>
            course._id === id ? data : course
          ),
        }) // Update the course in the list
    );
  },

  // Fetch unpaid students for a course
  fetchUnpaidStudents: (courseId) =>
    get().handleRequest(
      () => axios.get(`/student/unpaid/${courseId}`),
      null,
      "Failed to fetch unpaid students.",
      (data) => {
        // Update unpaidStudents and studentPayments
        const studentPayments = {};
        data.unpaidStudents.forEach((student) => {
          studentPayments[student.student._id] = {
            paidMonths: student.paidMonths,
            unpaidMonths: student.unpaidMonths,
          };
        });
        set({ unpaidStudents: data.unpaidStudents, studentPayments });
      }
    ),

  // Mark a payment as paid
  markAsPaid: async (studentId, courseId, amount, paymentType) => {
    const paymentId = prompt("Enter Payment ID:");
    if (!paymentId) {
      toast.error("Payment ID is required.");
      return;
    }

    await get().handleRequest(
      () =>
        axios.post("/api/student/payment", {
          studentId,
          courseId,
          amount,
          paymentType,
          paymentId,
        }),
      "Payment marked successfully.",
      "Failed to update payment.",
      () => get().fetchUnpaidStudents(courseId) // Refresh unpaid students list
    );
  },

  // Make a payment for specific months
  makePayment: async (studentId, courseId, amount, selectedMonths = []) => {
    try {
      const response = await axios.post(`/student/pay/${studentId}/${courseId}`, {
        amount,
        paymentType: "monthly",
        selectedMonths,
      });

      if (response.status === 201) {
        toast.success("Payment marked successfully.");

        // Update studentPayments in the store
        const { studentPayments } = get();
        studentPayments[studentId] = {
          paidMonths: response.data.paidMonths,
          unpaidMonths: response.data.unpaidMonths,
        };

        set({ studentPayments });

        // Refresh the unpaid students list
        get().fetchUnpaidStudents(courseId);
      } else {
        toast.error(response.data.message || "Payment failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error occurred.");
    }
  },

  // Delete a course
  deleteCourse: (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    get().handleRequest(
      () => axios.delete(`/courses/${id}`),
      "Course deleted successfully.",
      "Failed to delete course.",
      () => set({ courses: get().courses.filter((course) => course._id !== id) }) // Remove course from list
    );
  },

  // Fetch feedbacks
  fetchFeedbacks: async () => {
    try {
      const response = await axios.get("/student/feedback");
      set({ feedbacks: response.data }); // Update feedbacks list
    } catch (error) {
      toast.error("Failed to fetch feedback.");
    }
  },

  // Delete feedback
  deleteFeedback: async (_id) => {
    try {
      await axios.delete(`/student/feedback/delete/${_id}`);
      toast.success("Feedback successfully deleted");
      // Refresh feedbacks list
      get().fetchFeedbacks();
    } catch (error) {
      return error.response?.data?.error || "Something went wrong!";
    }
  },

  // Fetch all instructors
  getAllInstructors: () =>
    get().handleRequest(
      () => axios.get("/all/instructors"),
      null,
      "Failed to fetch instructors.",
      (data) => set({ instructors: data }) // Update instructors list
    ),

  // Create a new instructor
  createInstructor: (instructorData) =>
    get().handleRequest(
      () => axios.post("/instructors", instructorData),
      "Instructor created successfully.",
      "Failed to create instructor.",
      (data) => set({ instructors: [...get().instructors, data] }) // Add new instructor to list
    ),

  // Delete an instructor
  deleteInstructor: (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;
    get().handleRequest(
      () => axios.delete(`/instructors/${id}`),
      "Instructor deleted successfully.",
      "Failed to delete instructor.",
      () => set({ instructors: get().instructors.filter((inst) => inst._id !== id) }) // Remove instructor from list
    );
  },
}));

export default useAdminStore;