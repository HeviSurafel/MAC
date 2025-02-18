import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useUserStore } from "./Store/useAuthStore";
import { Toaster } from "react-hot-toast";
import UserManagement from "./Dashboard/Admin/UserManagement";
import LoginPage from "./Pages/LoginPage";
import Layout from "./Layout/Layout";
import HomePage from "./Pages/HomePage";
import ContactUsPage from "./Pages/ContactUsPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ServicePage from "./Pages/ServicePage";
import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardOverview from "./Dashboard/DashboardOverview";
import Profile from "./Dashboard/Profile/Profile";
import AssessmentManagement from "./Dashboard/AssessmentManagement";
import FeedbackPage from "./Dashboard/Student/FeedbackPage";
import InstructorsPage from "./Dashboard/Admin/InstructorsPage";
import SettingsPage from "./Pages/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "./Components/LoadingSpinner";
import CourseManagement from "./Dashboard/Admin/CourseManagement"
// Define roles
const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  INSTRUCTOR: "instructor",
};

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

	useEffect(() => {
		checkAuth();
	}, []);


	if (checkingAuth) return <LoadingSpinner />;
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/service" element={<ServicePage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />

            {/* Admin-Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="users" element={<UserManagement />} />
              <Route path="instructor" element={<InstructorsPage />} />
            </Route>

            {/* Student-Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
              <Route path="feedback" element={<FeedbackPage />} />
            </Route>

            {/* Shared Routes (Accessible by All Authenticated Users) */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STUDENT, ROLES.INSTRUCTOR]} />}>
              <Route path="profile" element={<Profile />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="instructor" element={<InstructorsPage />} />
              <Route path="assessments" element={<AssessmentManagement />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
