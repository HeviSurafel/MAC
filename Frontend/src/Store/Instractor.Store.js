import { create } from "zustand";
import axios from "../lib/axios";

const useInstructorStore = create((set) => ({
  courses: [],
  courseStudents: [],
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
  
  updateAssessment: async (studentId, updatedData, selectedCourse, selectedSection) => {
    set({ isLoading: true });

    try {
      console.log("Updating Assessment with:", {
        studentId,
        selectedCourse,
        selectedSection,
        updatedData,
      });

      if (!selectedCourse || !selectedSection || !studentId) {
        throw new Error("Missing required parameters: courseId, section, or studentId");
      }

      const response = await axios.put(
        `/instructor/assessments/update/${selectedCourse}/${selectedSection}/${studentId}`,
        updatedData
      );

      if (response.status !== 200) throw new Error("Failed to update assessment");

      set((state) => ({
        courseStudents: state.courseStudents.map((student) =>
          student._id === studentId ? { ...student, ...updatedData } : student
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Error updating assessment", isLoading: false });
      console.error("Error updating assessment:", error);
    }
  },


}));

export default useInstructorStore;
