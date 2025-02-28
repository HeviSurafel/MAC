import React,{useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaBook, FaCog, FaSignOutAlt } from "react-icons/fa";
import useAuthStore from "../Store/useAuthStore"; // Import authentication store

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Get user data from the store
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar
  // Sidebar links
  const links = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
 
    { path: "/dashboard/profile", icon: <FaUsers />, label: "Profile" },
    { path: "/dashboard/courses", icon: <FaBook />, label: "Courses" },
    { path: "/dashboard/assessments", icon: <FaBook />, label: "Assessments" },
    { path: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
  ];

  // Add Feedback and contact us message only if the user is a student
  if (user?.role === "student" || user?.role === "admin") {
    links.push({
      path: "/dashboard/feedback",
      icon: <FaBook />,
      label: "Feedback",
    }); 
  }
  if(user?.role === "admin"){
    links.push({ path: "/dashboard/users",icon: <FaUsers />, label: "Users"});
    links.push({
      path: "/dashboard/contactUs",
      icon: <FaBook />,
      label: "ContactUs",
    });
    links.push({
      path: "/dashboard/payement",
      icon: <FaBook />,
      label: "Payment",
    });
  }
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
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
        <button
          className="flex items-center w-full p-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
