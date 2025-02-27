import React from "react";
import { useUserStore } from "../../Store/useAuthStore";
import { FaPen } from "react-icons/fa";
function AddressSection({ onEdit }) {
  const { user } = useUserStore();
  console.log(user);
  return (
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
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1">{user?.address}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">{user?.phone}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1">
              {new Date(user?.dateOfBirth).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressSection;
