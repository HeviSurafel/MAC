import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 ml-64 pt-16 p-6"> {/* Added ml-64 for left margin */}
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
