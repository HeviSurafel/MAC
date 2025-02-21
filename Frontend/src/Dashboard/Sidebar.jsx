import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt } from "react-icons/fa";
import useAuthStore from "../Store/useAuthStore"; // Import authentication store

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore(); // Get user data from the store

  // Sidebar links
  const links = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/dashboard/users", icon: <FaUsers />, label: "Users" },
    { path: "/dashboard/profile", icon: <FaUsers />, label: "Profile" },
    { path: "/dashboard/courses", icon: <FaBook />, label: "Courses" },
    { path: "/dashboard/assessments", icon: <FaBook />, label: "Assessments" },
    { path: "/dashboard/instructor", icon: <FaUsers />, label: "Instructor" },
    { path: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
  ];

  // Add Feedback only if the user is a student
  if (user?.role === "student") {
    links.push({ path: "/dashboard/feedback", icon: <FaBook />, label: "Feedback" });
  }

  return (
    <div className="w-64 bg-gray-800 text-white fixed top-16 left-0 h-screen flex flex-col">
      {/* Logo and Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Makalla Academy</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center p-4 text-sm font-medium transition duration-200 ${
                  location.pathname === link.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full p-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200">
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
