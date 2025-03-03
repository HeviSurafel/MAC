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
  const [sectionStudents, setSectionStudents] = useState([]); // State to store filtered students

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

  // Filter students based on the selected section
  useEffect(() => {
    if (selectedCourseDetails && selectedSection) {
      // Filter students for the selected section
      const filteredStudents = selectedCourseDetails.studentsEnrolled.filter(
        (student) => student.section === selectedSection
      );
      setSectionStudents(filteredStudents); // Update the state with filtered students
    } else {
      setSectionStudents([]); // Reset if no section is selected
    }
  }, [selectedCourseDetails, selectedSection]);
  console.log(adminCourses);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin: {user?.name}
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
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select a course</option>
            {adminCourses?.map(({ _id, courseName }) => (
              <option key={_id} value={_id}>
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
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select a section</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Details */}
      {selectedCourseDetails && (
        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">
            {selectedCourseDetails.courseName}
          </h2>
          <p className="text-gray-600 text-md mb-4">
            {selectedCourseDetails.description}
          </p>
          <p className="text-lg font-medium text-gray-800">
            Instructor:{" "}
            {selectedCourseDetails.instructors
              .map((inst) => `${inst.firstName} ${inst.lastName}`)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Student Table */}
      {selectedCourse && selectedSection && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Student Assessments
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : sectionStudents.length === 0 ? (
            <p className="text-center text-gray-500">
              No students found for this section.
            </p>
          ) : (
            <>
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border p-3 text-left capitalize">First Name</th>
                    <th className="border p-3 text-left capitalize">Last Name</th>
                    <th className="border p-3 text-left capitalize">Assignment Score</th>
                    <th className="border p-3 text-left capitalize">Exam Score</th>
                    <th className="border p-3 text-left capitalize">Final Score</th>
                    <th className="border p-3 text-left capitalize">Course Status</th> {/* New Column */}
                  </tr>
                </thead>
                <tbody>
                  {sectionStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="border p-3 text-gray-700">
                        {student.firstName}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {student.lastName}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {student.assignmentScore ?? 0}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {student.examScore ?? 0}
                      </td>
                      <td
                        className={`border p-3 font-bold ${
                          student.finalScore >= 75
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {student.finalScore ?? 0}
                      </td>
                      <td className="border p-3 text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            student.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : student.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selectedCourseDetails.courseStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {}}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Reset Course
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;