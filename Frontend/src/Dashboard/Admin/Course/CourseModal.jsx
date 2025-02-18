import React, { useEffect, useState } from "react";

const CourseModal = ({ isOpen, onClose, course, onSave, instructors, onChange, courseCode }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    instructorName: "",
    status: "Active",
    courseCode: "",
  });

  // Update form fields when course prop changes
  useEffect(() => {
    if (course) {
      setCourseData({ ...course }); // Clone course object
    }
  }, [course]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCourseData({
      ...courseData,
      [field]: value,
    });
    onChange(field, value); // Update parent component state as well
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass courseData to parent for saving
    onSave(courseData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-11/12 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {course ? "Edit Course" : "Add Course"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={courseData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            />
          </div>

          {/* Instructor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select
              value={courseData.instructorName}
              onChange={(e) => handleInputChange("instructorName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Instructor</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst.user.firstName}>
                  {inst.user.firstName}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={courseData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Course Code */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
            <input
              type="text"
              value={courseData.courseCode || courseCode}
              onChange={(e) => handleInputChange("courseCode", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {course ? "Save Changes" : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
