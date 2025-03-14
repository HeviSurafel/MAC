import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1  pt-16 p-6"> {/* Added ml-64 for left margin */}
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
