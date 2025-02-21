const express = require("express");
const router = express.Router();
const { protectRoute, InstractorRoute } = require("../Middleware/Protect.route");
const {
  getInstructorCoursesAndStudents,
  getCourseStudentsBySection,
  gradeAssessment,
} = require("../Controllers/Instructor.controller");

// Instructor Routes
router.get("/instructor/courses", protectRoute, InstractorRoute, getInstructorCoursesAndStudents);
router.get("/instructor/courses/:courseId/sections/:selectedSection/students", protectRoute, InstractorRoute, getCourseStudentsBySection);
router.put("/instructor/assessments/:assessmentId", protectRoute, InstractorRoute, gradeAssessment);

module.exports = router;
