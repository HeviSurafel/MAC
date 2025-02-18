import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import useUserStore from "../../Store/AdminStore";
import CourseCard from "./Course/CourseCard";
import CourseModal from "./Course/CourseModal";

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
  const { instructor, deleteCourse, updateCourse, courses, getCourses, createCourse, getAllInstructors } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    subDescription: "",
    instructorName: "",
    status: "Active",
    courseCode: "",
  });

  useEffect(() => {
    getCourses();
    getAllInstructors();
  }, []); // Runs only once when the component mounts

  const filteredCourses = courses.filter(
    (course) =>
      course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCourse = async (id) => {
    try {
      console.log("Deleting course with ID:", id);
      await deleteCourse(id);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openAddModal = () => {
    setEditingCourse(null); // Reset editingCourse when adding a new one
    setNewCourse({
      title: "",
      description: "",
      subDescription: "",
      instructorName: "",
      status: "Active",
      courseCode: generateCourseCode(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setNewCourse(course); // Prefill the modal with existing data
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setNewCourse({
      title: "",
      description: "",
      subDescription: "",
      instructorName: "",
      status: "Active",
      courseCode: "",
    });
  };

  const saveCourse = async () => {
    const courseToSave = editingCourse ? editingCourse : { ...newCourse };
    if (!courseToSave._id) {
      delete courseToSave._id;
    }
    console.log(courseToSave);
    if (editingCourse) {
      // If editing, update the course
      await updateCourse(courseToSave._id, courseToSave);
    } else {
      // If new course, create it
      await createCourse(courseToSave);
    }
    closeModal();
  };

  const handleCourseChange = (field, value) => {
    if (editingCourse) {
      setEditingCourse((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewCourse((prev) => ({ ...prev, [field]: value }));
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
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Course
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            openEditModal={openEditModal}
            deleteCourse={() => handleDeleteCourse(course._id)}
          />
        ))}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={editingCourse || newCourse} // Use editingCourse if available
        onSave={saveCourse}
        instructors={instructor}
        onChange={handleCourseChange}
        courseCode={(editingCourse || newCourse).courseCode} // Ensure the correct course code
      />
    </div>
  );
};

export default CourseManagement;
