import React from 'react';
import DashboardOverview from '../Dashboard/DashboardOverview';
import UserManagement from './CourseManagement';
import CourseManagement from './CourseManagement';

const MainContent = ({ activeTab }) => {
    // Determine which component to render based on the activeTab prop
    const renderContent = () => {
      switch (activeTab) {
        case 'overview':
          return <DashboardOverview />;
        case 'users':
          return <UserManagement />;
        case 'courses':
          return <CourseManagement />;
        default:
          return <DashboardOverview />;
      }
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        {/* Render the appropriate content */}
        {renderContent()}
      </div>
    );
  };
  
  export default MainContent;