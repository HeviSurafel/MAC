import React, { useEffect } from "react";

const sections = ["A", "B", "C", "D", "E", "F", "G"];

const InstructorView = ({
  user,
  courseStatus,
  courses,
  selectedCourse,
  setSelectedCourse,
  selectedSection,
  setSelectedSection,
  fetchCourseStudents,
  students = [],
  editedAssessments,
  setEditedAssessments,
  isSubmitted,
  updateAllAssessments,
  markCourseAsCompleted,
  generateCertificates,
  fetchCourseStatus,
  courseStudents,
}) => {
  useEffect(() => {
    if (selectedCourse && selectedSection) {
      fetchCourseStatus(selectedCourse, selectedSection);
      fetchCourseStudents(selectedCourse, selectedSection);
    }
  }, [selectedCourse, selectedSection]);

  const handleAssessmentChange = (studentId, key, value) => {
    setEditedAssessments((prev) => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [key]: Number(value),
        },
      };
      updated[studentId].finalScore =
        (updated[studentId].assignmentScore ?? 0) +
        (updated[studentId].examScore ?? 0);
      return updated;
    });
  };

  // ✅ Save all assessments function
  const saveAllAssessments = async () => {
    if (!selectedCourse || !selectedSection) {
      console.error("Course or section not selected.");
      return;
    }

    const assessments = courseStudents.map((student) => {
      const editedData = editedAssessments[student._id] || {};
      return {
        studentId: student._id,
        assignmentScore:
          editedData.assignmentScore ?? student.assignmentScore ?? 0,
        examScore: editedData.examScore ?? student.examScore ?? 0,
        finalScore: editedData.finalScore ?? student.finalScore ?? 0,
      };
    });

    await updateAllAssessments(assessments, selectedCourse, selectedSection);
    setEditedAssessments({});
    fetchCourseStudents(selectedCourse, selectedSection);
  };

  // ✅ Disable inputs and buttons if the course is "completed"
  const isEditable = courseStatus === "incomplete";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Instructor: {user?.name}
      </h1>

      {/* Course & Section Selection */}
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

      {/* Student Table */}
      {selectedCourse && selectedSection && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-lg font-semibold mb-4">Student List</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">First Name</th>
                <th className="border p-3">Last Name</th>
                <th className="border p-3">Assignment Score</th>
                <th className="border p-3">Exam Score</th>
                <th className="border p-3">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {courseStudents.length > 0 ? (
                courseStudents.map((student) => (
                  <tr key={student._id} className="text-center">
                    <td className="border p-3">{student.firstName}</td>
                    <td className="border p-3">{student.lastName}</td>
                    <td className="border p-3">
                      <input
                        type="number"
                        value={
                          editedAssessments[student._id]?.assignmentScore ??
                          student.assignmentScore ??
                          0
                        }
                        onChange={(e) =>
                          handleAssessmentChange(
                            student._id,
                            "assignmentScore",
                            e.target.value
                          )
                        }
                        className="w-full border rounded p-2"
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border p-3">
                      <input
                        type="number"
                        value={
                          editedAssessments[student._id]?.examScore ??
                          student.examScore ??
                          0
                        }
                        onChange={(e) =>
                          handleAssessmentChange(
                            student._id,
                            "examScore",
                            e.target.value
                          )
                        }
                        className="w-full border rounded p-2"
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border p-3 font-bold">
                      {editedAssessments[student._id]?.finalScore ??
                        student.finalScore ??
                        0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border p-3 text-center text-gray-500">
                    No students found for this course and section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 text-right">
        <button
          onClick={saveAllAssessments}
          className={`text-white px-6 py-2 rounded-md mr-4 ${
            isEditable
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditable}
        >
          Save All
        </button>
        <button
          onClick={() => {
            if (selectedCourse && selectedSection) {
              markCourseAsCompleted(selectedCourse, selectedSection);
            } else {
              console.error("Course or section not selected.");
            }
          }}
          className={`text-white px-6 py-2 rounded-md ${
            isEditable
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditable}
        >
          Submit All
        </button>
      </div>
    </div>
  );
};

export default InstructorView;
