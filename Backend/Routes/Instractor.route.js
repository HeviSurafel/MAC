const express = require("express");
const router = express.Router();
const { protectRoute, InstractorRoute } = require("../Middleware/Protect.route");
const {
  getInstructorCoursesAndStudents,
  getCourseStudentsBySection,
  updateAssessment,
} = require("../Controllers/Instructor.controller");

// Instructor Routes
router.get("/instructor/courses", protectRoute, InstractorRoute, getInstructorCoursesAndStudents);
router.get("/instructor/courses/:courseId/sections/:selectedSection/students", protectRoute, InstractorRoute, getCourseStudentsBySection);
router.put("/instructor/assessments/update/:courseId/:section/:studentId", updateAssessment);


module.exports = router;
