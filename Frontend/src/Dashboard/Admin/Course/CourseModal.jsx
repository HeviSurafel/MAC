import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAdminStore from "../../../Store/AdminStore";
const generateCourseCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};
const CourseModal = ({
  isOpen,
  onClose,
  course,
  onSave,
  courses,
  onChange = () => {},
  courseCode,
}) => {
  const { instructors, getAllInstructors } = useAdminStore();
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    instructors: [],
    status: "Active",
    courseCode: courseCode || "",
    paymentType: "one-time",
    cost: "",
    batches: [],
    selectedBatch: "",
    durationInMonths: 3,
    startDate: "",
    endDate: "",
    registrationFee: 0,
  });

  const [courseTitles, setCourseTitles] = useState([]);
  const [showNewCourseInput, setShowNewCourseInput] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newBatchName, setNewBatchName] = useState("");

  // Fetch all instructors on component mount
  useEffect(() => {
    getAllInstructors();
  }, [getAllInstructors]);

  // Update course data when `course` or `courseCode` props change
  useEffect(() => {
    if (course) {
      setCourseData({
        ...course,
        batches: course.batches || [],
        selectedBatch: course.batches.length > 0 ? course.batches[0]._id : "",
        startDate: course.startDate ? course.startDate.split("T")[0] : "",
        endDate: course.endDate ? course.endDate.split("T")[0] : "",
      });
    } else {
      setCourseData((prev) => ({
        ...prev,
        courseCode: courseCode || "",
      }));
    }
  }, [course, courseCode]);

  // Update course titles when `courses` prop changes
  useEffect(() => {
    if (courses && courses.length > 0) {
      setCourseTitles(courses.map((c) => c.courseName));
    }
  }, [courses]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  // Handle batch selection from dropdown
  const handleBatchSelection = (e) => {
    const selectedBatchId = e.target.value;
    setCourseData((prev) => ({
      ...prev,
      selectedBatch: selectedBatchId,
    }));
  };

  // Add a new batch
  const addBatch = () => {
    if (newBatchName.trim()) {
      const newBatch = {
        name: newBatchName,
        _id: Date.now().toString(),
      };
      setCourseData((prev) => ({
        ...prev,
        batches: [...prev.batches, newBatch],
        selectedBatch: newBatch._id,
      }));
      setNewBatchName("");
    }
  };

  // Handle course title selection
  const handleCourseTitleChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "other") {
      setShowNewCourseInput(true);
      setCourseData((prev) => ({
        ...prev,
        courseName: "",
        description: "",
        instructors: [],
        batches: [],
        selectedBatch: "",
        courseCode: generateCourseCode(), // Generate a new courseCode for new courses
      }));
    } else {
      setShowNewCourseInput(false);
      const selectedCourse = courses.find((c) => c.courseName === selectedValue);
      if (selectedCourse) {
        setCourseData((prev) => ({
          ...prev,
          ...selectedCourse,
          courseCode: selectedCourse.courseCode, // Preserve the existing courseCode
          startDate: selectedCourse.startDate ? selectedCourse.startDate.split("T")[0] : "",
          endDate: selectedCourse.endDate ? selectedCourse.endDate.split("T")[0] : "",
          batches: selectedCourse.batches || [],
          selectedBatch: selectedCourse.batches.length > 0 ? selectedCourse.batches[0]._id : "",
        }));
      }
    }
  };

  // Add a new course title
  const addNewCourseTitle = () => {
    if (newCourseTitle.trim()) {
      setCourseTitles((prev) => [...prev, newCourseTitle]);
      setCourseData((prev) => ({
        ...prev,
        courseName: newCourseTitle,
      }));
      setNewCourseTitle("");
      setShowNewCourseInput(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cost before submission:", courseData.cost); // Log the cost before submission
    if (!courseData.startDate || !courseData.endDate) {
      alert("Please select a start and end date.");
      return;
    }
    if (new Date(courseData.endDate) < new Date(courseData.startDate)) {
      alert("End date must be after start date.");
      return;
    }
    onSave(courseData); // Pass the courseData to the parent component or backend
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {course ? "Edit Course" : "Add Course"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Course Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <select
              value={courseData.courseName}
              onChange={handleCourseTitleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a course</option>
              {courseTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
              <option value="other">Other (Add New Course)</option>
            </select>
          </div>

          {/* New Course Title Input */}
          {showNewCourseInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Course Title
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new course title"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={addNewCourseTitle}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Course Description */}
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

          {/* Instructors Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor(s)
            </label>
            <select
              value={courseData.instructors[0] || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? [] : [e.target.value];
                handleInputChange("instructors", value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Not Assigned</option>
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
              onChange={(e) => handleInputChange("registrationFee", e.target.value)}
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
              <option value="one-time">One-Time Payment</option>
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
              value={courseData.courseCode}
              onChange={(e) => handleInputChange("courseCode", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Batches Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batches
            </label>
            <select
              value={courseData.selectedBatch}
              onChange={handleBatchSelection}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a batch</option>
              {courseData.batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Batch */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Batch
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter new batch name"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addBatch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
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
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
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

CourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  courses: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  courseCode: PropTypes.string,
};

export default CourseModal;