// StudentView.jsx
import React from "react";

const StudentView = ({ user, studentandgrades, loading }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Student: {user?.name}
      </h1>
      <h2 className="text-xl font-bold mb-4">Your Courses and Grades</h2>
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Course Name</th>
            <th className="px-4 py-2">Assignment Score</th>
            <th className="px-4 py-2">Exam Score</th>
            <th className="px-4 py-2">Final Score</th>
          </tr>
        </thead>
        <tbody>
          {studentandgrades?.enrolledCourses?.length > 0 ? (
            studentandgrades.enrolledCourses.map((course) => {
              const grade = studentandgrades.grades.find(
                (g) => g.courseId === course._id
              );
              return (
                <tr key={course._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{course.courseName}</td>
                  <td className="px-4 py-2">{grade?.assignmentScore ?? "N/A"}</td>
                  <td className="px-4 py-2">{grade?.examScore ?? "N/A"}</td>
                  <td className="px-4 py-2">{grade?.finalScore ?? "N/A"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentView;
