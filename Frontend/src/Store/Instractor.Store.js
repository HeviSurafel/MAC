import { create } from "zustand";

const useInstructorStore = create((set) => ({
  courses: [],
  courseStudents: [],
  courseAssessments: [],
  isLoading: false,
  error: null,

  fetchInstructorCourses: async (instructorId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/instructors/${instructorId}/courses`);
      const data = await response.json();
      set({ courses: data, isLoading: false });
    } catch (err) {
      console.error("Failed to load courses.", err);
      set({ error: "Failed to load courses.", isLoading: false });
    }
  },

  fetchCourseStudents: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/courses/${courseId}/students`);
      const data = await response.json();
      set({ courseStudents: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load students", isLoading: false });
    }
  },

  fetchCourseAssessments: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/courses/${courseId}/assessments`);
      const data = await response.json();
      set({ courseAssessments: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load assessments", isLoading: false });
    }
  },

  updateAssessment: async (updatedAssessment) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/assessments/${updatedAssessment.id}`, {
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
