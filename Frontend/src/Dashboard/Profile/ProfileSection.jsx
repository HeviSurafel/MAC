import React from "react";
import { FaPen } from "react-icons/fa";
import Logo from "../../assets/image01.jpg";
import { useUserStore } from "../../Store/useAuthStore";

function ProfileSection({ onEdit }) {
  const { user } = useUserStore();
  console.log(user);
  return (
    <div className="flex items-center justify-between mb-6 p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-4">
        <img src={Logo} alt="Profile" className="h-16 w-16 rounded-full" />
        <div>
          <div className="text-xl font-semibold"></div>
          <div className="text-sm text-gray-500 uppercase">
            {user.role === "student" ? "STUDENT" : "INSTRACTOR" + "\t"}{" "}
            {user.name}
          </div>
          <div className="text-sm text-gray-500 uppercase">
            {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    
    
    </div>
  );
}

export default ProfileSection;
