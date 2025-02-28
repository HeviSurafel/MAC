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
import LoadingSpinner from "./Components/LoadingSpinner";
import CourseManagement from "./Dashboard/Admin/CourseManagement";
import ResetPassword from "./Pages/ResetPassword";
import FeedbackList from "./Dashboard/Admin/FeedbackList";
import ContactMessages from "./Dashboard/Admin/ContactMessages";
import Footer from "./Components/Footer";
import PaymentPage from "./Dashboard/Payment/PaymentPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  // useEffect(() => {
  //   checkAuth();
  // }, []);
  // // Show loading spinner while checking authentication
  // if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicePage />} />
            {user ? (
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="instructor" element={<InstructorsPage />} />
                {user.role === "student" && (
                  <Route path="feedback" element={<FeedbackPage />} />
                )}
                <Route path="profile" element={<Profile />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="assessments" element={<AssessmentManagement />} />
                <Route path="feedback" element={<FeedbackList />} />
                <Route path="contactUs" element={<ContactMessages />} />
                <Route path="settings" element={<SettingsPage />} />
                {user.role === "admin" && (   <Route path="payement" element={<PaymentPage />} />)}
             
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Route>
        </Routes>
      
      </div>
      <Footer className="w-full bg-gradient-to-r from-blue-600 to-teal-500 py-10 px-6 mt-auto" />
      <Toaster />
    </div>
  );
}

export default App;
