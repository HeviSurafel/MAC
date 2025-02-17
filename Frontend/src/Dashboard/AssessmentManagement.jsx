import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AssessmentManagement = () => {
  // Sample assessment data with student names, course, and results
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      studentName: "Surafel wondu",
      courseName: "Web Development",
      assignmentResult: 85,
      examResult: 90,
      finalExamResult: 88,
      grade: "",
    },
    {
        id: 1,
        studentName: "Surafel wondu",
        courseName: "Web Development",
        assignmentResult: 85,
        examResult: 90,
        finalExamResult: 88,
        grade: "",
      },
      {
        id: 1,
        studentName: "Surafel wondu",
        courseName: "Web Development",
        assignmentResult: 85,
        examResult: 90,
        finalExamResult: 88,
        grade: "",
      },
  ]);

  const [isTeacher, setIsTeacher] = useState(true); // Flag to indicate if user is a teacher
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  // Calculate the grade based on assignment, exam, and final exam results
  const calculateGrade = (assessment) => {
    const total =
      (assessment.assignmentResult || 0) +
      (assessment.examResult || 0) +
      (assessment.finalExamResult || 0);
    const average = total / 3;

    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
  };

  // Open modal for adding/updating marks
  const openEditModal = (assessment) => {
    setEditingAssessment(assessment);
    setIsEditModalOpen(true);
  };

  // Close modal
  const closeEditModal = () => {
    setEditingAssessment(null);
    setIsEditModalOpen(false);
  };

  // Save edited marks
  const saveEditedMarks = (updatedAssessment) => {
    updatedAssessment.grade = calculateGrade(updatedAssessment);
    setAssessments(
      assessments.map((assessment) =>
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment
      )
    );
    closeEditModal();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Instructor: Mr. Mikael Tesfaye</h1>

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
          {assessments.map((assessment) => (
            <tr key={assessment.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{assessment.studentName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{assessment.courseName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.assignmentResult !== null
                  ? assessment.assignmentResult
                  : "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.examResult !== null ? assessment.examResult : "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.finalExamResult !== null
                  ? assessment.finalExamResult
                  : "Not Assigned Yet"}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {assessment.grade || "Not Graded Yet"}
              </td>
              {isTeacher && (
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-4"
                    onClick={() => openEditModal(assessment)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {} /* Handle delete */}
                  >
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
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
