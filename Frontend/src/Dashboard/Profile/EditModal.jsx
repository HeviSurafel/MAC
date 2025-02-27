import React, { useState } from 'react';
import {useUserStore} from "../../Store/useAuthStore"
const EditModal = ({ section, closeModal, user }) => {
  const [formData, setFormData] = useState({
    address: user?.address,
    phone: user?.phone,
  });
const {updateProfile}=useUserStore()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold">{`Edit ${section}`}</h2>
        <form>
          {section === 'address' && (
            <>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="Address"
              />
              <input
                type="text"
                name="postalCode"
                value={new Date(user?.dateOfBirth).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                disabled
                className="block w-full p-2 mt-4"
                placeholder="Postal Code"
              />
              <input
                type="phoneNumber"
                name="phoneNumber"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="Tax ID"
              />
            </>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
