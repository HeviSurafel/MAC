import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaTimesCircle } from 'react-icons/fa';
import useAdminStore  from "../../Store/AdminStore"; // Import the function to create an instructor
import useUserStore from "../../Store/useAuthStore";

// Initial instructors data (could be empty initially)
const initialInstructors = [];

const InstructorsPage = () => {
  const {user}=useUserStore();
  const {instructor, createInstractor,getAllInstructors ,deleteInstructor} = useAdminStore();
  const [instructors, setInstructors] = useState(initialInstructors);
  const [showForm, setShowForm] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "",
  });
  useEffect(() => {
    getAllInstructors();
  }, [instructor]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor({
      ...newInstructor,
      [name]: value,
    });
  };
console.log(instructor)
  // Handle form submission (creating a new instructor)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, department } = newInstructor;
    if (firstName && lastName && email && password && department) {
        try {
            const response = await createInstractor({firstName, lastName, email, password, department});
            setInstructors([...instructors, response]);
            setNewInstructor({ firstName: "", lastName: "", email: "", password: "", department: "" });
            setShowForm(false);
        } catch (error) {
            console.error("Error creating instructor:", error);
            alert("Something went wrong while creating the instructor.");
        }
    } else {
        alert("Please fill in all fields.");
    }
};
  // Handle deleting an instructor
  const handleDelete = async(id) => {
    try {
      // Assuming removeInstructor() from store to delete the instructor
     const response = await deleteInstructor(id);
      setInstructors(instructors.filter((instructor) => instructor.id !== id));
    } catch (error) {
      console.error("Error deleting instructor:", error);
      alert("Something went wrong while deleting the instructor.");
    }
  };

  // Handle other actions (like remove, update, etc.)
  const handleRemove = (id) => {
    alert(`Instructor with ID ${id} removed (soft deletion or some other logic).`);
  };

  const handleUpdate = (id) => {
    alert(`Updating instructor with ID ${id}`);
  };

  const handleViewDetails = (id) => {
    const instructor = instructors.find((instructor) => instructor.id === id);
    alert(`Viewing details for ${instructor.name}`);
  };
  console.log(instructor)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Instructors List
        </h1>

     {user.role==="admin" &&(
       <div className="text-right mb-6">
       <button
         onClick={() => setShowForm(!showForm)}
         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
       >
         {showForm ? "Cancel" : "Create Instructor"}
       </button>
     </div>
     )  
    }
      
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-8 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Instructor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newInstructor.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter instructor's first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newInstructor.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter instructor's last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newInstructor.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter instructor's email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newInstructor.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={newInstructor.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter department"
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

        {/* Instructor List Table */}
        <table className="min-w-full table-auto text-left mt-8">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">FirstName</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">LastName</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Department</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructor?.length===0?"": instructor?.map((instructor) => (
              <tr key={instructor.id} className="border-b">
                <td className="px-4 py-2 text-gray-700">{instructor.user?.firstName}</td>
                <td className="px-4 py-2 text-gray-700">{instructor.user?.lastName}</td>
                <td className="px-4 py-2 text-gray-700">{instructor.user?.email}</td>
                <td className="px-4 py-2 text-gray-700">{instructor.department}</td>
                {user?.role==="admin" && (  <td className="px-2 py-2 flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(instructor.id)}
                    className="text-gray-500 hover:text-gray-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    onClick={() => handleUpdate(instructor.id)}
                    className="text-yellow-500 hover:text-yellow-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(instructor._id)}
                    className="text-red-500 hover:text-red-700 font-bold py-1 px-3 rounded-lg transition duration-200"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>)}
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorsPage;
