import React, { useState } from "react";

const ProfileManagement = ({ profile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Management</h2>
      <div className="p-4 bg-white rounded-lg shadow-md">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Email"
            />
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Program"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-800"><span className="font-semibold">Name:</span> {profile.name}</p>
            <p className="text-gray-800"><span className="font-semibold">Student ID:</span> {profile.id}</p>
            <p className="text-gray-800"><span className="font-semibold">Email:</span> {profile.email}</p>
            <p className="text-gray-800"><span className="font-semibold">Program:</span> {profile.program}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;