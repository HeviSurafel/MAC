// UserManagement.js
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminStore from "../../Store/AdminStore";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

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

  const createUserNewUser = () => {
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      status: "Active",
      password: formData.password,
    };
    createUser([...users, newUser]);
    setIsModalOpen(false);
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          <FaPlus className="inline mr-2" /> Add User
        </button>
      </div>

      {isModalOpen && (
        <UserModal
          formData={formData}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          createUserNewUser={createUserNewUser}
        />
      )}
     <UserTable users={users} handleDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default UserManagement;
