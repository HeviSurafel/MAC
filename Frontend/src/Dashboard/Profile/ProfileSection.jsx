import React from 'react';
import { FaPen } from 'react-icons/fa';
import Logo from "../../assets/image01.jpg";

function ProfileSection({onEdit}) {
  return(
    <div className="flex items-center justify-between mb-6 p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center space-x-4">
      <img
        src={Logo}
        alt="Profile"
        className="h-16 w-16 rounded-full"
      />
      <div>
        <div className="text-xl font-semibold"></div>
        <div className="text-sm text-gray-500">Product Designer</div>
        <div className="text-sm text-gray-500">Los Angeles, California, USA</div>
      </div>
    </div>
    <button
      className="text-blue-500 hover:text-blue-700"
      onClick={onEdit}
    >
      <span className="flex items-center gap-2  text-sm">
        <FaPen size={12} />
        Edit
      </span>
    </button>
  </div>
   )
}

export default ProfileSection

