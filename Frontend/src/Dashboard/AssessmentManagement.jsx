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
    courses, // Array of instructor courses
    courseStudents, 
    getInstructorCoursesAndStudents, 
    fetchCourseStudents, 
    updateAllAssessments, 
    markCourseAsCompleted, 
    generateCertificates, 
    fetchCourseStatus 
  } = useInstructorStore();

  const { courses: adminCourses, getCourses } = useAdminStore();
  const { studentandgrades, fetchCoursesandGrades, loading: studentLoading } = useStudentStore();

  // ✅ Manage selected course & section properly
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [editedAssessments, setEditedAssessments] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courseStatus, setCourseStatus] = useState(""); // ✅ Store fetched courseStatus

  useEffect(() => {
    if (user?.role === "instructor") {
      getInstructorCoursesAndStudents();
    } else if (user?.role === "admin") {
      getCourses();
    } else {
      fetchCoursesandGrades();
    }
  }, [user]);

  // ✅ Reset selectedSection when changing selectedCourse
  useEffect(() => {
    setSelectedSection(""); // Clear section when course changes
    setCourseStatus(""); // Reset course status
  }, [selectedCourse]);

  // ✅ Fetch course status dynamically when both course and section are selected
  useEffect(() => {
    if (selectedCourse && selectedSection) {
      fetchCourseStatus(selectedCourse, selectedSection).then((status) => {
        setCourseStatus(status || ""); // Ensure status updates correctly
      });
    }
  }, [selectedCourse, selectedSection]);

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
          courseStatus={courseStatus} // ✅ Now dynamically updated
          courseStudents={courseStudents}
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
