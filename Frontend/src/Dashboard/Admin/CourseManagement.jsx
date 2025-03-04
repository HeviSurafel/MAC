import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import useAdminStore from "../../Store/AdminStore";
import CourseCard from "./Course/CourseCard";
import CourseModal from "./Course/CourseModal";
import useUserStore from "../../Store/useAuthStore";

const generateCourseCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const CourseManagement = () => {
  const { user } = useUserStore();
  const { deleteCourse, updateCourse, courses, getCourses, createCourse } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getCourses();
 
  }, [getCourses]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null); // Reset editingCourse when modal closes
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const filteredCourses = (courses || []).filter(
    (course) =>
      course?.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete the course. Please try again.");
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, courseData);
      } else {
        await createCourse(courseData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save the course. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" aria-label="Search" />
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Course
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            openEditModal={() => openEditModal(course)}
            deleteCourse={() => handleDeleteCourse(course._id)}
          />
        ))}
      </div>

      {user?.role === "admin" && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          course={editingCourse}
          onSave={handleSaveCourse}
          courseCode={editingCourse?.courseCode || generateCourseCode()}
        />
      )}
    </div>
  );
};

export default CourseManagement;
