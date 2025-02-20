import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import useInstructorStore from "../Store/Instractor.Store";
import { useUserStore } from "../Store/useAuthStore";

const AssessmentManagement = () => {
  const { user } = useUserStore(); // Get the logged-in user (instructor)
  const { courses, fetchCourseAssessments, courseAssessments, fetchInstructorCourses,fetchCourseStudents, courseStudents, updateAssessment } = useInstructorStore(); // Store actions and data
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  useEffect(() => {
    if (user?.role === "instructor") {
      setIsTeacher(true);
    }

    // Fetch instructor's courses when the component mounts
    if (user?.id) {
      fetchInstructorCourses(user?.id); // Assuming user has an id property
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch students for the selected course
      fetchCourseStudents(selectedCourse);
    }
  }, [selectedCourse]);

  const openEditModal = (assessment) => {
    setEditingAssessment(assessment);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingAssessment(null);
    setIsEditModalOpen(false);
  };

  const saveEditedMarks = (updatedAssessment) => {
    // updatedAssessment.grade = calculateGrade(updatedAssessment);
    // updateAssessment(updatedAssessment);
    // closeEditModal();
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    fetchCourseAssessments(courseId); // Fetch assessments for the selected course
  };
  console.log(courses)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Instructor: {user?.name}</h1>

      {/* Course Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourse || ""}
          onChange={handleCourseChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Students List */}
      <div className="mb-6">
        <h3 className="text-xl font-bold">Students in the course</h3>
        <ul>
          {courseStudents.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </div>

      {/* Assessment Table */}
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Student Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Course Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Assignment Result</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Exam Result</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Final Exam Result</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Grade</th>
            {isTeacher && (
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {courseAssessments.map((assessment) => (
            <tr key={assessment.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{assessment.studentName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{assessment.courseName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.assignmentResult || "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.examResult || "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.finalExamResult || "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.grade || "Not Graded Yet"}
              </td>
              {isTeacher && (
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-blue-500 hover:text-blue-700 mr-4" onClick={() => openEditModal(assessment)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => {}}>
                    <FaTrash />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Marks Modal */}
      {isEditModalOpen && editingAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingAssessment.studentName} - Update Marks
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedMarks(editingAssessment);
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Result</label>
                <input
                  type="number"
                  value={editingAssessment.assignmentResult || ""}
                  onChange={(e) =>
                    setEditingAssessment({
                      ...editingAssessment,
                      assignmentResult: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Result</label>
                <input
                  type="number"
                  value={editingAssessment.examResult || ""}
                  onChange={(e) =>
                    setEditingAssessment({
                      ...editingAssessment,
                      examResult: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Final Exam Result</label>
                <input
                  type="number"
                  value={editingAssessment.finalExamResult || ""}
                  onChange={(e) =>
                    setEditingAssessment({
                      ...editingAssessment,
                      finalExamResult: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="mr-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentManagement;
