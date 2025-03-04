import React, { useEffect, useState } from "react";
import useAdminStore from "../../../Store/AdminStore";

const CourseModal = ({
  isOpen,
  onClose,
  course,
  onSave,
  onChange = () => {}, // ✅ Default function to prevent errors
  courseCode,
}) => {
  const { instructors, getAllInstructors } = useAdminStore();
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    instructors: [],
    status: "Active",
    courseCode: "",
    paymentType: "one-time",
    cost: "",
    durationInMonths: 3,
    startDate: "",
    endDate: "",
    registrationFee: 0,
  });

  useEffect(() => {
    getAllInstructors();
  }, [getAllInstructors]);

  useEffect(() => {
    if (course) {
      setCourseData({
        ...course,
        startDate: course.startDate ? course.startDate.split("T")[0] : "",
        endDate: course.endDate ? course.endDate.split("T")[0] : "",
      });
    } else {
      setCourseData({
        courseName: "",
        description: "",
        instructors: [],
        status: "Active",
        courseCode: courseCode || "",
        paymentType: "one-time",
        cost: "",
        durationInMonths: 3,
        startDate: "",
        endDate: "",
        registrationFee: 0,
      });
    }
  }, [course, courseCode]);

  const handleInputChange = (field, value) => {
    setCourseData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });

    // ✅ Prevent calling `onChange` if it's not passed
    if (typeof onChange === "function") {
      onChange(field, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseData.startDate || !courseData.endDate) {
      alert("Please select a start and end date.");
      return;
    }
    onSave(courseData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {course ? "Edit Course" : "Add Course"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={courseData.courseName}
              onChange={(e) => handleInputChange("courseName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            />
          </div>

          {/* Instructor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor
            </label>
            <select
              multiple
              value={courseData.instructors || []}
              onChange={(e) => {
                const selectedInstructors = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                console.log("Selected Instructors:", selectedInstructors);
                handleInputChange("instructors", selectedInstructors);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>
                Select an Instructor
              </option>
              {instructors?.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.firstName} {inst.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Fee */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Fee
            </label>
            <input
              type="number"
              value={courseData.registrationFee}
              onChange={(e) =>
                handleInputChange("registrationFee", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Payment Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <select
              value={courseData.paymentType}
              onChange={(e) => handleInputChange("paymentType", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="one-time">One-time Payment</option>
              <option value="monthly">Monthly Subscription</option>
            </select>
          </div>

          {/* Course Fee */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Fee (Birr)
            </label>
            <input
              type="number"
              value={courseData.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Course Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              value={courseData.courseCode || courseCode}
              onChange={(e) => handleInputChange("courseCode", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={courseData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={courseData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
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
