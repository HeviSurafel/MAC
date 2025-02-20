import React, { useEffect, useState } from "react";

const UserModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  createUser,
  courses,
}) => {
  if (!isModalOpen) return null;
  const [section, setSection] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectValue, setSelectValue] = useState("");
  const [selectedSection, setSelectedSection] = useState(""); // New state for selected section

  useEffect(() => {
    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
      setFormData((prev) => ({ ...prev, password }));
    };
    generatePassword();
  }, [setFormData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courses: selectedCourses,
      section: selectedSection,
    }));
  }, [selectedCourses, selectedSection, setFormData]); // Include section in formData update

  const handleCourseSelection = (e) => {
    const selectedCourse = e.target.value;
    if (selectedCourse && !selectedCourses.includes(selectedCourse)) {
      setSelectedCourses((prev) => [...prev, selectedCourse]);
    }
    setSelectValue(""); // Reset select after adding
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((c) => c !== courseId));
  };

  const handleCreateUser = async () => {
    await createUser({
      ...formData,
      courses: selectedCourses,
      section: selectedSection,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form>
          {/* User Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Address and Date of Birth */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Password and Role */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="text"
                value={formData.password||""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>

          {/* Course Selection for Students or Instructors */}
          {(formData.role === "student" || formData.role === "instructor") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {formData.role === "student"
                  ? "Select Course"
                  : "Assign Courses"}
              </label>
              <select
                onChange={handleCourseSelection}
                className="w-full p-2 border rounded-lg"
                value={selectValue}
              >
                <option value="" disabled>
                  {formData.role === "student"
                    ? "-- Select a Course --"
                    : "-- Select Courses --"}
                </option>
                {courses?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>

              {/* Section Selection for Students or Instructors */}
              {selectedCourses.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Class Section
                  </label>
                  <select
                    value={selectedSection} // Add this to bind the value
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="" disabled>
                      -- Select a Section --
                    </option>
                    {section.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCourses.map((courseId) => {
                  const course = courses.find((c) => c._id === courseId);
                  return (
                    <span
                      key={courseId}
                      className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-lg"
                    >
                      {course?.courseName || "Unknown Course"}
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(courseId)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateUser}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
