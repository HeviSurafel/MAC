import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminStore from "../../Store/AdminStore";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import useUserStore from "../../Store/useAuthStore";

const UserManagement = () => {
  const { user } = useUserStore();
  const { users, detailUser, courses, createUser, getAllUsers, getUserById, suspendUser, UnSuspendUser, getCourses, deleteUser } = AdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all"); // State for role filter
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    getAllUsers();
    getCourses();
  }, []);

  // Filter users based on the searchQuery and selected role
  const filteredUsers = users?.filter((user) => {
    const matchesSearchQuery =
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearchQuery && matchesRole;
  });

  const handleSuspendUser = async (id) => {
    try {
      await suspendUser(id);
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleUnSuspendUser = async (id) => {
    try {
      await UnSuspendUser(id);
    } catch (error) {
      console.error("Error unsuspending user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            <FaPlus className="inline mr-2" /> Add User
          </button>
        )}
      </div>

      {/* Role Filter Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>

      {isModalOpen && (
        <UserModal
          isModalOpen={isModalOpen}
          formData={formData}
          setFormData={setFormData}
          createUser={createUser}
          setIsModalOpen={setIsModalOpen}
          courses={courses}
        />
      )}

      <UserTable
        user={user}
        courses={courses}
        users={filteredUsers}
        handleUnSuspendUser={handleUnSuspendUser}
        handleDeleteUser={handleDeleteUser}
        handleSuspendUser={handleSuspendUser}
        getUserById={getUserById} // Pass getUserById
      />
    </div>
  );
};

export default UserManagement;
