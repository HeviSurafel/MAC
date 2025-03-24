import React, { useState } from "react";
import { FaEye, FaUserSlash, FaTrash, FaUserCheck } from "react-icons/fa";
import UserDetailModal from './UserDetailModal'; // Import Modal Component

const UserTable = ({
  user,
  courses,
  users,
  handleDeleteUser,
  handleSuspendUser,
  handleUnSuspendUser,
  getUserById
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const DetailUser = async (userId) => {
    try {
      const userDetails = await getUserById(userId); // Fetch user details by ID
      setSelectedUser(userDetails); // Set the selected user
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            {user?.role === "admin" && (
              <th className="p-3 text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((userItem) => (
            <tr
              key={userItem._id}
              className="border-b hover:bg-gray-50 transition duration-200"
            >
              <td className="p-3">
                {userItem.firstName} {userItem.lastName}
              </td>
              <td className="p-3">{userItem.email}</td>
              <td className="p-3">{userItem.role}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    userItem.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : userItem.status === "Suspended"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {userItem.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEye onClick={() => DetailUser(userItem._id)} />
                </button>
                <button
                  className={`${
                    userItem.status !== "active"
                      ? "text-yellow-500 hover:text-yellow-700"
                      : "text-green-500 hover:text-green-700"
                  }`}
                >
                  {userItem.status === "active" ? (
                    <FaUserSlash onClick={() => handleSuspendUser(userItem._id)} />
                  ) : (
                    <FaUserCheck onClick={() => handleUnSuspendUser(userItem._id)} />
                  )}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteUser(userItem._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          userDetails={selectedUser}
          isOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default UserTable;
