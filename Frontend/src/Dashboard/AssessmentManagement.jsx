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
    fetchCourseStatus,
  } = useInstructorStore();

  const { courses: adminCourses, getCourses } = useAdminStore();
  const {
    studentandgrades,
    fetchCoursesandGrades,
    loading: studentLoading,
  } = useStudentStore();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [editedAssessments, setEditedAssessments] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courseStatus, setCourseStatus] = useState("");

  useEffect(() => {
    if (user?.role === "instructor") {
      getInstructorCoursesAndStudents();
    } else if (user?.role === "admin") {
      getCourses();
    } else if (user?.role === "student") {
      fetchCoursesandGrades();
    }
  }, [user]);

  useEffect(() => {
    setSelectedSection("");
    setCourseStatus("");
  }, [selectedCourse]);

  if (user?.role === "instructor") {
    useEffect(() => {
      if (selectedCourse && selectedSection) {
        fetchCourseStatus(selectedCourse, selectedSection).then((status) => {
          setCourseStatus(status || "");
        });
      }
    }, [selectedCourse, selectedSection]);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {user?.role === "student" ? (
        <StudentView
          user={user}
          studentandgrades={studentandgrades}
          loading={studentLoading}
        />
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
      ) : user?.role === "instructor" ? (
        <InstructorView
          user={user}
          courseStatus={courseStatus}
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
      ) : (
        <p>Unauthorized access. Please contact support.</p>
      )}
    </div>
  );
};

export default AssessmentManagement;
