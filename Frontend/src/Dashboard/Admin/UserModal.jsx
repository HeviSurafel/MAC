// UserModal.js
import React from "react";

const UserModal = ({ isModalOpen, setIsModalOpen, formData, setFormData, createUserNewUser, handlePasswordGeneration }) => {
  if (!isModalOpen) return null;

  return (
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
          <div className="flex items-center justify-center mb-4 space-x-2">
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
              className="bg-gray-300 text-sm p-2 rounded-lg"
            >
              Generate
            </button>
          </div>
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
  );
};

export default UserModal;
