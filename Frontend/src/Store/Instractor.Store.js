import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useInstructorStore = create((set, get) => ({
  courses: [],
  courseStudents: [],
  isLoading: false,
  error: null,
  courseStatus: null,
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
  getInstructorCourses: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses`);
      set({ courses: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to load courses.", err);
      set({ error: "Failed to load courses.", isLoading: false });
    }
  },

  // Fetch students for a specific course and section
  fetchCourseStudents: async (courseId, section, selectedBatch) => {
    console.log("Fetching students for:", { courseId, section, selectedBatch });
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `/instructor/courses/${courseId}/${section}/students/${selectedBatch}`
      );
      set({ courseStudents: response.data.students, isLoading: false });
      return response.data.students;
    } catch (error) {
      console.error("Failed to load students:", error);
      set({ error: "Failed to load students", isLoading: false });
      return [];
    }
  },

  // Update all assessments and refetch data
  updateAllAssessments: async (assessments, courseId, section) => {
    if (!window.confirm("Are you sure you want to update all assessments?")) return;

    set({ isLoading: true });
    try {
      const response = await axios.put(
        `/instructor/assessments/updateAll/${courseId}/${section}`,
        { assessments }
      );
      set({ courseStudents: response.data.assessment.studentResults, isLoading: false });
      toast.success("Assessments updated successfully!");
      await get().fetchCourseStudents(courseId, section); // 🔄 Auto-refresh student list
    } catch (error) {
      console.error("Error updating all assessments:", error);
      set({ error: "Error updating all assessments", isLoading: false });
      toast.error("Error updating assessments.");
    }
  },

  // Mark course as completed and refetch status
  markCourseAsCompleted: async (courseId, section) => {
    if (!window.confirm("Are you sure you want to mark this course as completed?")) return;

    set({ isLoading: true });
    try {
      await axios.put(`/instructor/courses/${courseId}/sections/${section}/complete`, {
        status: "completed",
      });
      set({ courseStatus: "completed", isLoading: false });
      toast.success("Course marked as completed!");
      await get().fetchCourseStatus(courseId, section); // 🔄 Auto-refresh course status
    } catch (error) {
      console.error("Error marking course as completed:", error);
      set({ error: "Error marking course as completed", isLoading: false });
      toast.error("Error marking course as completed.");
    }
  },

  // Fetch course status
  fetchCourseStatus: async (courseId, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/sections/${section}/status`);
      set({ courseStatus: response.data.status, isLoading: false });
    
      return response.data.status;
    } catch (error) {
      console.error("Error fetching course status:", error);
      set({ error: "Error fetching course status", isLoading: false });
      return null;
    }
  },

  // Generate certificates and refresh student list
  generateCertificates: async (courseId, section, students) => {
    if (!window.confirm("Are you sure you want to generate certificates for these students?")) return;

    set({ isLoading: true });
    try {
      await axios.post(`/instructor/certificates/generate/${courseId}`, { students });
      set({ isLoading: false });
      toast.success("Certificates generated successfully!");
      await get().fetchCourseStudents(courseId, section); // 🔄 Auto-refresh students
    } catch (error) {
      console.error("Error generating certificates:", error);
      set({ error: "Error generating certificates", isLoading: false });
      toast.error("Error generating certificates.");
    }
  },

}));

export default useInstructorStore;
