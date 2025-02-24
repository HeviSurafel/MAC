import React, { useState, useEffect } from "react";
import useInstructorStore from "../Store/Instractor.Store";
import useStudentStore from "../Store/student.store";
import { useUserStore } from "../Store/useAuthStore";
import useAdminStore from "../Store/AdminStore";
import StudentView from "./Assessment/StudentView";
import InstructorView from "./Assessment/InstructorView";
import AdminView from "./Assessment/AdminView";

const AssessmentManagement = () => {
  const { user } = useUserStore();
  
  const { 
    courses, 
    getInstructorCoursesAndStudents, 
    fetchCourseStudents, 
    updateAllAssessments, 
    markCourseAsCompleted, 
    generateCertificates, 
    fetchCourseStatus 
  } = useInstructorStore();

  const { courses: adminCourses, getCourses } = useAdminStore();
  const { studentandgrades, fetchCoursesandGrades, loading: studentLoading } = useStudentStore();

  // ✅ Fix: Manage selected course & section properly
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [editedAssessments, setEditedAssessments] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user?.role === "instructor") {
      getInstructorCoursesAndStudents(); // ✅ No need to add it in dependencies
    } else if (user?.role === "admin") {
      getCourses(); // ✅ Removed invalid parameters
    } else {
      fetchCoursesandGrades();
    }
  }, [user]); // ✅ Removed unnecessary function dependencies

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {user?.role === "student" ? (
        <StudentView user={user} studentandgrades={studentandgrades} loading={studentLoading} />
      ) : user?.role === "admin" ? (
        <AdminView
          user={user}
          courses={adminCourses}
          getCourses={getCourses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse} 
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      ) : (
        <InstructorView 
          user={user} 
          courses={courses} 
          selectedCourse={selectedCourse} 
          setSelectedCourse={setSelectedCourse} 
          selectedSection={selectedSection} 
          setSelectedSection={setSelectedSection} 
          fetchCourseStudents={fetchCourseStudents} 
          editedAssessments={editedAssessments} 
          setEditedAssessments={setEditedAssessments} 
          isSubmitted={isSubmitted} 
          setIsSubmitted={setIsSubmitted} 
          updateAllAssessments={updateAllAssessments} 
          markCourseAsCompleted={markCourseAsCompleted} 
          generateCertificates={generateCertificates} 
          fetchCourseStatus={fetchCourseStatus}
        />
      )}
    </div>
  );
};

export default AssessmentManagement;
