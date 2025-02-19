import React, { useEffect, useState } from "react";

const UserModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  createUser,
  coursesList,
}) => {
  if (!isModalOpen) return null;

  const [selectedCourses, setSelectedCourses] = useState(formData.courses || []);
  const [newCourse, setNewCourse] = useState("");

  useEffect(() => {
    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setFormData((prev) => ({ ...prev, password }));
    };
    generatePassword();
  }, [setFormData]);

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId); // Remove course if already selected
      }
      return [...prevSelectedCourses, courseId]; // Add course if not selected
    });
  };

  const handleAddNewCourse = () => {
    if (newCourse.trim()) {
      setSelectedCourses((prev) => [...prev, newCourse.trim()]);
      setNewCourse("");
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, courses: selectedCourses }));
  }, [selectedCourses, setFormData]);

  const createUserNewUser = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      dateOfBirth,
      address,
      phoneNumber,
      courses,
    } = formData;

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      status,  // Ensure the status is lowercase
      dateOfBirth,
      address,
      phoneNumber,
      courses,  // Array of course IDs or course names
    };

    // Call the createUser function from the global state management
    await createUser(userData);  // Call the global createUser function

    // Close the modal after successful user creation
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              value={formData.password}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Courses Selection (For Students and Instructors) */}
          {formData.role === "student" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Courses</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Enter course name"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddNewCourse}
                  className="bg-green-500 text-white p-2 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                {selectedCourses.map((course, index) => (
                  <span key={index} className="inline-block bg-gray-200 text-gray-800 px-3 py-1 mr-2 mb-2 rounded-lg">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.role === "instructor" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Courses</label>
              <div className="space-y-2">
                {coursesList?.map((course) => (
                  <div key={course._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={course._id}
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                      className="mr-2"
                    />
                    <label htmlFor={course._id} className="text-sm">{course.courseName}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              onClick={createUserNewUser}
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
