import React, { useState } from "react";
import EditModal from "../Dashboard/Profile/EditModal";

const SettingsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState("");

  const handleEdit = (section) => {
    setSectionToEdit(section);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 p-6 rounded-xl">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
              Settings
            </h2>

            {/* Profile Settings */}
            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">Edit Profile</h3>
                <p className="text-gray-600">Update your personal information</p>
              </div>
              <button
                onClick={() => handleEdit("profile")}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>

            {/* Change Password */}
            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">Change Password</h3>
                <p className="text-gray-600">Update your password for security</p>
              </div>
              <button
                onClick={() => handleEdit("password")}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>

            {/* Notification Settings */}
            <div className="flex justify-between items-center py-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">Notification Settings</h3>
                <p className="text-gray-600">Choose how you'd like to be notified</p>
              </div>
              <button
                onClick={() => handleEdit("notifications")}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>

            {/* Deactivate Account */}
            <div className="flex justify-between items-center py-4">
              <div>
                <h3 className="font-semibold text-lg text-red-600">Deactivate Account</h3>
                <p className="text-gray-600">Permanently delete your account</p>
              </div>
              <button
                onClick={() => handleEdit("deactivate")}
                className="text-red-600 hover:text-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <EditModal section={sectionToEdit} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
