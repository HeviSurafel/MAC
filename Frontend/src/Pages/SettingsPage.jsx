import React, { useState } from "react";
import PasswordModal from "./PasswordModal";
import {useUserStore} from "../Store/useAuthStore"
const SettingsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
const {user,updatePassword}=useUserStore();

  const handleEditPassword = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChangePassword = (data) => {
    updatePassword(data.oldPassword,data.newPassword,user.email);
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 p-6 rounded-xl">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

        {/* Change Password Section */}
        <div className="flex justify-between items-center py-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Change Password</h3>
            <p className="text-gray-600">Update your password for security</p>
          </div>
          <button
            onClick={handleEditPassword}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal 
        isOpen={isModalOpen} 
        closeModal={closeModal} 
        onSubmit={handleChangePassword} 
        user={user}
      />
    </div>
  );
};

export default SettingsPage;
