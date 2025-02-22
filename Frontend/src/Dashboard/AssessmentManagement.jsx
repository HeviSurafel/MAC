import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import useInstructorStore from "../Store/Instractor.Store";
import { useUserStore } from "../Store/useAuthStore";

const sections = ["A", "B", "C", "D", "E", "F", "G"];

const AssessmentManagement = () => {
  const { user } = useUserStore();
  const {
    courses,
    getInstructorCoursesAndStudents,
    fetchCourseStudents,
    updateAssessment,
    courseStudents,
  } = useInstructorStore();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  useEffect(() => {
    if (user?.role === "instructor") {
      getInstructorCoursesAndStudents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse && selectedSection) {
      fetchCourseStudents(selectedCourse, selectedSection);
    }
  }, [selectedCourse, selectedSection]);

  const openEditModal = (student) => {
    setEditingAssessment({
      studentId: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      assignmentWeight: student.assignmentWeight ?? "",
      examWeight: student.examWeight ?? "",
      finalWeight: student.finalWeight ?? "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingAssessment(null);
    setIsEditModalOpen(false);
  };

  const handleAssessmentChange = (key, value) => {
    setEditingAssessment((prev) => ({ ...prev, [key]: value }));
  };

  const saveEditedMarks = async (e) => {
    e.preventDefault();
    if (editingAssessment?.studentId) {
      await updateAssessment(
        editingAssessment.studentId,
        {
          assignmentWeight: editingAssessment.assignmentWeight,
          examWeight: editingAssessment.examWeight,
          finalWeight: editingAssessment.finalWeight,
        },
        selectedCourse,
        selectedSection
      );
      fetchCourseStudents(selectedCourse, selectedSection);
      closeEditModal();
    } else {
      console.error("Invalid assessment data:", editingAssessment);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Instructor: {user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses?.map(({ courseId, courseName }) => (
              <option key={courseId} value={courseId}>
                {courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-blue-500"
            disabled={!selectedCourse}
          >
            <option value="">Select a section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourse && selectedSection && (
        <>
          <h3 className="text-xl font-bold mb-4">
            Students in {courses.find((c) => c.courseId === selectedCourse)?.courseName} - Section {selectedSection}
          </h3>

          <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Assignment Result</th>
                <th className="px-4 py-2">Exam Result</th>
                <th className="px-4 py-2">Final Exam Result</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseStudents?.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                  <td className="px-4 py-2">{student.assignmentWeight ?? "Not Assigned"}</td>
                  <td className="px-4 py-2">{student.examWeight ?? "Not Assigned"}</td>
                  <td className="px-4 py-2">{student.finalWeight ?? "Not Assigned"}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(student)}>
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {isEditModalOpen && editingAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
              Edit Marks for {editingAssessment.firstName} {editingAssessment.lastName}
            </h2>
            <form onSubmit={saveEditedMarks}>
              {["assignmentWeight", "examWeight", "finalWeight"].map((key) => (
                <div className="mb-4" key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace("Weight", " Result")}
                  </label>
                  <input type="number" value={editingAssessment[key] ?? ""} onChange={(e) => handleAssessmentChange(key, e.target.value)} className="w-full p-2 border rounded-lg focus:ring-blue-500" min="0" max="100" required />
                </div>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={closeEditModal} className="mr-3 py-2 px-4 bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentManagement;
