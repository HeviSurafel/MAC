import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaTimesCircle } from 'react-icons/fa';

// Sample data
const initialInstructors = [
  {
    id: 1,
    name: "John Doe",
    rating: 4.5,
    courses: ["Mathematics", "Physics"],
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4.7,
    courses: ["Computer Science", "Data Structures"],
    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Michael Lee",
    rating: 4.2,
    courses: ["Chemistry", "Biology"],
    profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [showForm, setShowForm] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    rating: 0,
    courses: "",
    profilePicture: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor({
      ...newInstructor,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newInstructor.name && newInstructor.rating && newInstructor.courses && newInstructor.profilePicture) {
      const newId = instructors.length + 1;
      setInstructors([
        ...instructors,
        {
          id: newId,
          name: newInstructor.name,
          rating: parseFloat(newInstructor.rating),
          courses: newInstructor.courses.split(","),
          profilePicture: newInstructor.profilePicture,
        },
      ]);
      setShowForm(false);
      setNewInstructor({ name: "", rating: 0, courses: "", profilePicture: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Handle deleting an instructor
  const handleDelete = (id) => {
    const filteredInstructors = instructors.filter((instructor) => instructor.id !== id);
    setInstructors(filteredInstructors);
  };

  // Handle removing an instructor (can be used for soft removal, for example)
  const handleRemove = (id) => {
    alert(`Instructor with ID ${id} removed (soft deletion or some other logic).`);
  };

  // Handle updating an instructor (for now, we’ll simply log their ID)
  const handleUpdate = (id) => {
    alert(`Updating instructor with ID ${id}`);
  };

  // Handle viewing details (for now, we’ll display an alert with the instructor's name)
  const handleViewDetails = (id) => {
    const instructor = instructors.find((instructor) => instructor.id === id);
    alert(`Viewing details for ${instructor.name}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Instructors List
        </h1>

        {/* Create Instructor Button */}
        <div className="text-right mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {showForm ? "Cancel" : "Create Instructor"}
          </button>
        </div>

        {/* Instructor Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-8 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Instructor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newInstructor.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter instructor's name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={newInstructor.rating}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter rating (0 to 5)"
                  min="0"
                  max="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
                <input
                  type="text"
                  name="courses"
                  value={newInstructor.courses}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter courses (comma separated)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="text"
                  name="profilePicture"
                  value={newInstructor.profilePicture}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter profile picture URL"
                  required
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                Add Instructor
              </button>
            </div>
          </form>
        )}

        {/* Instructor Table */}
        <table className="min-w-full table-auto text-left mt-8">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Rating</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Courses</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Profile Picture</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="border-b">
                <td className="px-4 py-2 text-gray-700">{instructor.name}</td>
                <td className="px-4 py-2 text-gray-700">{instructor.rating}</td>
                <td className="px-4 py-2 text-gray-700">
                  <ul>
                    {instructor.courses.map((course, index) => (
                      <li key={index} className="text-sm text-gray-600">{course}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <img
                    src={instructor.profilePicture}
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="px-2 py-2 flex space-x-2">
                  {/* View Details */}
                  <button
                    onClick={() => handleViewDetails(instructor.id)}
                    className="text-gray-500 hover:text-gray-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaEye size={16} />
                  </button>
                  {/* Update */}
                  <button
                    onClick={() => handleUpdate(instructor.id)}
                    className="text-yellow-500 hover:text-yellow-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaEdit size={16} />
                  </button>
                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(instructor.id)}
                    className="text-blue-500 hover:text-blue-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaTimesCircle size={16} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(instructor.id)}
                    className="text-red-500 hover:text-red-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorsPage;
