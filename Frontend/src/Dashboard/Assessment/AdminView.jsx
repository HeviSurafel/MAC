import React, { useEffect, useState } from "react";

const AdminView = ({
  user,
  courses: adminCourses,
  selectedCourse,
  setSelectedCourse,
  selectedSection,
  setSelectedSection,
  getCourses,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourse && selectedSection) {
      setLoading(true);
      getCourses(selectedCourse, selectedSection)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [selectedCourse, selectedSection, getCourses]);

  // Find selected course details
  const selectedCourseDetails = adminCourses.find(
    (course) => course._id === selectedCourse
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin: {user?.name}</h1>

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
            {adminCourses?.map(({ _id, courseName }) => (
              <option key={_id} value={_id}>{courseName}</option>
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
            {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Details */}
      {selectedCourseDetails && (
        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCourseDetails.courseName}
          </h2>
          <p className="text-gray-600 text-md">{selectedCourseDetails.description}</p>
          <p className="text-lg font-medium text-gray-800 mt-2">
            Instructor: {selectedCourseDetails.instructors.map((inst) => `${inst.firstName} ${inst.lastName}`).join(", ")}
          </p>
        </div>
      )}

      {/* Student Table */}
      {selectedCourse && selectedSection && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-lg font-semibold mb-4">Student Assessments</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : adminCourses.length === 0 ? (
            <p className="text-center text-gray-500">No students found for this course and section.</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border p-3">First Name</th>
                  <th className="border p-3">Last Name</th>
                  <th className="border p-3">Assignment Score</th>
                  <th className="border p-3">Exam Score</th>
                  <th className="border p-3">Final Score</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourseDetails?.studentsEnrolled?.map((student) => (
                  <tr key={student._id} className="text-center hover:bg-gray-100">
                    <td className="border p-3">{student.firstName}</td>
                    <td className="border p-3">{student.lastName}</td>
                    <td className="border p-3">{student.assignmentScore ?? 0}</td>
                    <td className="border p-3">{student.examScore ?? 0}</td>
                    <td className={`border p-3 font-bold ${student.finalScore >= 75 ? "text-green-600" : "text-red-500"}`}>
                      {student.finalScore ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;
