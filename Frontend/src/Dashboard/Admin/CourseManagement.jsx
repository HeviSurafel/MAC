import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaCertificate } from "react-icons/fa";

const CourseManagement = () => {
  // Mock course data
  const [courses, setCourses] = useState([
    { id: 1, title: "React Basics", description: "Learn the basics of React", status: "Active" },
    { id: 2, title: "Advanced JavaScript", description: "Master advanced JavaScript concepts", status: "Inactive" },
    { id: 3, title: "Tailwind CSS", description: "Learn how to use Tailwind CSS", status: "Active" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null); // Track the course being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control edit modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Control add modal visibility
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false); // Control certificate modal visibility
  const [selectedCourse, setSelectedCourse] = useState(null); // Track the course for certificate generation
  const [newCourse, setNewCourse] = useState({ title: "", description: "", status: "Active" }); // Track new course data

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete course
  const deleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  // Open edit modal
  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingCourse(null);
    setIsEditModalOpen(false);
  };

  // Save edited course
  const saveEditedCourse = (updatedCourse) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    closeEditModal();
  };

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewCourse({ title: "", description: "", status: "Active" }); // Reset form
  };

  // Save new course
  const saveNewCourse = () => {
    const course = { id: courses.length + 1, ...newCourse }; // Generate a new ID
    setCourses([...courses, course]);
    closeAddModal();
  };

  // Open certificate modal
  const openCertificateModal = (course) => {
    setSelectedCourse(course);
    setIsCertificateModalOpen(true);
  };

  // Close certificate modal
  const closeCertificateModal = () => {
    setSelectedCourse(null);
    setIsCertificateModalOpen(false);
  };

  // Generate certificate
  const generateCertificate = () => {
    alert(`Certificate generated for: ${selectedCourse.title}`);
    closeCertificateModal();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Course
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    course.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {course.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(course)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => openCertificateModal(course)}
                  >
                    <FaCertificate />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-md shadow-2xl transform transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Course</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedCourse(editingCourse);
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-md shadow-2xl transform transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Course</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveNewCourse();
              }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newCourse.status}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-md shadow-2xl transform transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Certificate</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to generate a certificate for{" "}
              <span className="font-semibold">{selectedCourse?.title}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeCertificateModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={generateCertificate}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;