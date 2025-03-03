import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useInstructorStore = create((set) => ({
  courses: [],
  courseStudents: [],
  isLoading: false,
  error: null,
  courseStatus: null,

  // Fetch instructor courses and students
  getInstructorCoursesAndStudents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/instructor/courses");
      set({ courses: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to load courses.", err);
      set({ error: "Failed to load courses.", isLoading: false });
    }
  },

  // Fetch students for a specific course and section
  fetchCourseStudents: async (courseId, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/sections/${section}/students`);
      set({ courseStudents: response.data.students, isLoading: false });
      return response.data.students; // Return students for use in the component
    } catch (error) {
      console.error("Failed to load students:", error);
      set({ error: "Failed to load students", isLoading: false });
      return []; // Return an empty array in case of error
    }
  },

  // Update all assessments
  updateAllAssessments: async (assessments, courseId, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`/instructor/assessments/updateAll/${courseId}/${section}`, {
        assessments,
      });
      set({ courseStudents: response.data.assessment.studentResults, isLoading: false });
      toast.success("Assessments updated successfully!");
    } catch (error) {
      console.error("Error updating all assessments:", error);
      set({ error: "Error updating all assessments", isLoading: false });
      toast.error("Error updating assessments.");
    }
  },

  // Mark course as completed
  markCourseAsCompleted: async (courseId, section) => {
    set({ isLoading: true });
    try {
      await axios.put(`/instructor/courses/${courseId}/sections/${section}/complete`, {
        status: "completed",
      });
      set({ courseStatus: "completed", isLoading: false });
      toast.success("Course marked as completed!");
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
      return response.data.status; // Return status for use in the component
    } catch (error) {
      console.error("Error fetching course status:", error);
      set({ error: "Error fetching course status", isLoading: false });
      return null; // Return null in case of error
    }
  },

  // Generate certificates
  generateCertificates: async (courseId, section, students) => {
    set({ isLoading: true });
    try {
      await axios.post(`/instructor/certificates/generate/${courseId}`, { students });
      set({ isLoading: false });
      toast.success("Certificates generated successfully!");
    } catch (error) {
      console.error("Error generating certificates:", error);
      set({ error: "Error generating certificates", isLoading: false });
      toast.error("Error generating certificates.");
    }
  },
}));

export default useInstructorStore;