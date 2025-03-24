import React, { useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { useUserStore } from "../../../Store/useAuthStore";

const CourseCard = ({ course, openEditModal, deleteCourse }) => {
  const { user } = useUserStore();
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false); // State for modal visibility
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        {/* Course Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif uppercase">
          {course.courseName}
        </h2>

        {/* Course Code */}
        <p className="text-gray-600 text-sm font-medium mb-2">
          <span className="font-semibold">Course Code:</span> {course.courseCode}
        </p>

        {/* Description */}
        <p className="text-gray-500 mb-4">
          <span className="font-semibold">Description:</span>{" "}
          {course?.description.length > 100
            ? course.description.substring(0, 100) + "..."
            : course.description}
          {course.description.length > 100 && (
            <button
              onClick={() => setIsDescriptionModalOpen(true)}
              className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
            >
              <FaInfoCircle className="inline" /> Read More
            </button>
          )}
        </p>

        {/* Instructor */}
        <p className="text-gray-600 font-medium mb-4">
          <span className="font-semibold">Instructor:</span>{" "}
          {course?.instructors?.length > 0
            ? `${course.instructors[0]?.firstName} ${course.instructors[0]?.lastName}`
            : "No Instructor Assigned"}
        </p>

        {/* Course Fee */}
        <p className="text-gray-600 font-medium mb-4">
          <span className="font-semibold">Course Fee:</span>{" "}
          {course.paymentType === "monthly"
            ? `birr ${course.cost} / month for ${course.duration} months`
            : `birr ${course.cost} (One-time registration)`}
        </p>

        {/* Students Enrolled */}
        <div className="text-gray-600 mb-4">
          <span className="font-semibold text-lg text-blue-500">
            {course.studentsEnrolled.length}
          </span>{" "}
          students enrolled
        </div>

        {/* Admin Controls */}
        {user.role === "admin" && (
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
              onClick={() => openEditModal(course)}
            >
              <FaEdit />
              Edit
            </button>
            <button
              className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
              onClick={() => deleteCourse(course._id)}
            >
              <FaTrash />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Description Popup Modal */}
      {isDescriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl h-[80vh] flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {course.courseName} - Full Description
            </h2>
            {/* Scrollable Description Container */}
            <div className="overflow-y-auto flex-1 mb-4">
              <p className="text-gray-600">{course.description}</p>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsDescriptionModalOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 self-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;