import { create } from "zustand";
import axios from "../lib/axios";

const useInstructorStore = create((set) => ({
  courses: [],
  courseStudents: [],
  courseAssessments: [],
  isLoading: false,
  error: null,

  getInstructorCoursesAndStudents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses`);
      set({ courses: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to load courses.", err);
      set({ error: "Failed to load courses.", isLoading: false });
    }
  },

  fetchCourseStudents: async (courseId, selectedSection) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/sections/${selectedSection}/students`);
      set({ courseStudents: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load students", isLoading: false });
    }
  },
  

  fetchCourseAssessments: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/instructor/courses/${courseId}/assessments`);
      set({ courseAssessments: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load assessments", isLoading: false });
    }
  },

  updateAssessment: async (updatedAssessment) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`/instructor/assessments/${updatedAssessment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAssessment),
      });

      if (!response.ok) throw new Error("Failed to update assessment");

      set((state) => ({
        courseAssessments: state.courseAssessments.map((assessment) =>
          assessment.id === updatedAssessment.id ? updatedAssessment : assessment
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Error updating assessment", isLoading: false });
    }
  },
}));

export default useInstructorStore;
