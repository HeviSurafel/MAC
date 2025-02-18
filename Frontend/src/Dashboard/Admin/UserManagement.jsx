import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaUserSlash, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import AdminStore from "../../Store/AdminStore";

const UserManagement = () => {
  const { users, createUser, getAllUsers, deleteUser } = AdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    emergencyContact: "",
    course: "",
    department: "",
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const generateCertificate = (user) => {
    const doc = new jsPDF();
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);
    doc.text("Makalla Technology Solution", 35, 140, { angle: 45 });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text("Certificate of Completion", 60, 60);
    doc.setFontSize(14);
    doc.text(`This is to certify that`, 70, 80);
    doc.setFontSize(16);
    doc.text(`${user.firstName} ${user.lastName}`, 70, 90);
    doc.setFontSize(14);
    doc.text(`has successfully completed the course.`, 55, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 60, 120);
    doc.text(`Signature: ___________________`, 60, 140);
    doc.save(`${user.firstName}_certificate.pdf`);
  };

  const deleteUserById = (id) => {
    deleteUser(id); // Call the deleteUser function from the store
  };

  const suspendUser = (id) => {
    // Logic to suspend user can be added here
  };

  const createUserNewUser = () => {
    const newUser = { 
      firstName: formData.firstName,
      lastName: formData.lastName, 
      email: formData.email, 
      role: formData.role, 
      status: "Active",
      password: formData.password // Consider hashing the password before sending
    };
    createUser([...users, newUser]);
    setIsModalOpen(false);
  };

  const handlePasswordGeneration = () => {
    const password = Math.random().toString(36).slice(-8); // Generates a random 8-character password
    setFormData({ ...formData, password });
  };

  const filteredUsers = users?.filter((user) => {
    const name = (user?.firstName + " " + user?.lastName).toLowerCase() || '';
    const email = user?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          <FaPlus className="inline mr-2" /> Add User
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add User</h2>
            <form>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-1">
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
              <div className="flex items-center justify-center  mb-4 space-x-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePasswordGeneration}
                  className="bg-gray-300 text-sm  p-2 rounded-lg"
                >
                  Generate
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {formData.role === "student" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  {/* More fields for students */}
                </>
              )}
              {formData.role === "instructor" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createUserNewUser}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="p-3">{user.firstName} {user.lastName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.status === "Active" ? "bg-green-100 text-green-600" : user.status === "Suspended" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => generateCertificate(user)}>
                    <FaEye />
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-700" onClick={() => suspendUser(user.id)}>
                    <FaUserSlash />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => deleteUserById(user.id)}>
                    <FaTrash />
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

export default UserManagement;
