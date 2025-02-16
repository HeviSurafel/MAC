import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Layout from "./Layout/Layout";
import HomePage from "./Pages/HomePage";
import ContactUsPage from "./Pages/ContactUsPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ServicePage from "./Pages/ServicePage";
import DashboardOverview from "./Dashboard/Admin/DashboardOverview";
import UserManagement from "./Dashboard/Admin/UserManagement";
import CourseManagement from "./Dashboard/Admin/CourseManagement";
import DashboardLayout from "./Dashboard/Admin/DashboardLayout";
import StudentDashboardLayout from "./Dashboard/Student/DashboardLayout"

// Dashboard Layout Component


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/service" element={<ServicePage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
        
        </Route>
        <Route path="student" element={<StudentDashboardLayout />} />

        {/* Student Dashboard Routes */}
  
      </Route>
    </Routes>
  );
}

export default App;