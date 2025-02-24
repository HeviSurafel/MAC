import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
const useInstructorStore = create((set) => ({
  courses: [],
  courseStudents: [],
  isLoading: false,
  error: null,
  courseStatus: "incomplete", // "incomplete" or "completed"

  // Fetch instructor courses and students
  getInstructorCoursesAndStudents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/instructor/courses");
      set({ courses: response.data, isLoading: false });
      toast.success("Courses loaded successfully!");
    } catch (err) {
      console.error("Failed to load courses.", err);
      set({ error: "Failed to load courses.", isLoading: false });
      toast.error("Failed to load courses.");
    }
  },

  // Fetch students for a specific course and section
  fetchCourseStudents: async (courseId, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/sections/${section}/students`);
      set({ courseStudents: response.data.students, isLoading: false });
      toast.success("Students loaded successfully!");
    } catch (error) {
      set({ error: "Failed to load students", isLoading: false });
      toast.error("Failed to load students.");
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
      set({ error: "Error updating all assessments", isLoading: false });
      toast.error("Error updating assessments.");
      console.error("Error updating all assessments:", error);
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
      set({ error: "Error marking course as completed", isLoading: false });
      toast.error("Error marking course as completed.");
      console.error("Error marking course as completed:", error);
    }
  },

  // Fetch course status
  fetchCourseStatus: async (courseId, section) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/sections/${section}/status`);
      set({ courseStatus: response.data.status, isLoading: false });
      toast.success("Course status fetched successfully!");
    } catch (error) {
      set({ error: "Error fetching course status", isLoading: false });
      toast.error("Error fetching course status.");
      console.error("Error fetching course status:", error);
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
      set({ error: "Error generating certificates", isLoading: false });
      toast.error("Error generating certificates.");
      console.error("Error generating certificates:", error);
    }
  },
}));


export default useInstructorStore;