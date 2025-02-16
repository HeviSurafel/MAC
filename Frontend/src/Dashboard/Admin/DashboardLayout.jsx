import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 pt-16">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
