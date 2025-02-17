import React from 'react';
import { FaPen } from 'react-icons/fa';

const PersonalInfoSection = ({ onEdit }) => (
  <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Personal Information</h2>
      <button
        className="text-blue-500 hover:text-blue-700 flex items-center gap-2 text-sm"
        onClick={onEdit}
      >
        <FaPen size={16} />
        Edit
      </button>
    </div>
    <div className="mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="mt-1">Jack</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="mt-1">Adams</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1">(213) 555-1234</div>
        </div>
        <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Email address</label>
        <div className="mt-1">jackadams@gmail.com</div>
      </div>
      </div>
     
    </div>
  </div>
);

export default PersonalInfoSection;
