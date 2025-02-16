import React from "react";

const CourseEnrollment = () => {
  const courses = [
    { id: 1, name: "React Mastery", instructor: "Mr Surafel Wondu" },
    { id: 2, name: "Node.js Fundamentals", instructor: "Mrs Hindeke Yeshak" },
    { id: 3, name: "Database Design", instructor: "Mr Mikael Tesfaye" },
  ];

  const handleEnroll = (courseId) => {
    alert(`Enrolled in course ID: ${courseId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Enrollment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{course.name}</h3>
            <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
            <button
              onClick={() => handleEnroll(course.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Enroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseEnrollment;