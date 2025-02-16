import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen shadow-md fixed">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard/courses"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Courses</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/grades"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Grades</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/certificates"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Certificates</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/transcripts"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Transcripts</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;