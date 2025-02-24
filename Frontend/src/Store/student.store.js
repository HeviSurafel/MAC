import { create } from "zustand";
import axios from "../lib/axios";

const useStudentStore = create((set) => ({
  studentandgrades: [],
  certificate: null,
  loading: false,
  error: null,

  // Fetch all courses the student is enrolled in
  fetchCoursesandGrades: async () => {
    console.log("Fetching courses...");
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/student/grades"); // Adjust API endpoint as needed
      set({ studentandgrades: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch courses",
        loading: false,
      });
    }
  },

  // Fetch student certificate
  fetchCertificate: async (studentId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `/api/student/certificate/${studentId}`,
        { responseType: "blob" }
      );

      const imageUrl = URL.createObjectURL(response.data);
      set({ certificate: imageUrl, loading: false });
    } catch (error) {
      console.error("Error fetching certificate:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch certificate",
        loading: false,
      });
    }
  },
  submitFeedback: async (comment) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post("/student/submit", { comment }); // Fix: Wrap in an object
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      set({
        error: error.response?.data?.message || "Failed to submit feedback",
        loading: false,
      });
    }
  }
  
  // Reset store state
}));

export default useStudentStore;
