import React from 'react';
import { FaPen } from 'react-icons/fa';

const AddressSection = ({ onEdit }) => (
  <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Address</h2>
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
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1">Ethiopia, Arbaminch sikela</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <div className="mt-1">ET 4400</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">TAX ID</label>
          <div className="mt-1">A8564178969</div>
        </div>
      </div>
    </div>
  </div>
);

export default AddressSection;
