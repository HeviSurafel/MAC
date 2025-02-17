import React, { useState } from 'react';

const EditModal = ({ section, closeModal }) => {
  const [formData, setFormData] = useState({
    firstName: 'Jack',
    lastName: 'Adams',
    email: 'jackadams@gmail.com',
    phone: '(213) 555-1234',
    address: 'United States of America, California, USA',
    postalCode: 'ERT 62574',
    taxId: 'A8564178969',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Handle save logic
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold">{`Edit ${section}`}</h2>
        <form>
          {section === 'personal' && (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="Email Address"
              />
            </>
          )}
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
                value={formData.postalCode}
                onChange={handleChange}
                className="block w-full p-2 mt-4"
                placeholder="Postal Code"
              />
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
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
