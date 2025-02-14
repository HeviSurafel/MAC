const express = require("express");
const router = express.Router();
const { protectRoute,InstractorRoute } = require("../Middleware/Protect.route");
const {
  getInstructorCourses,
  getCourseStudents,
  uploadCourseMaterial,
  createAssessment,
  gradeAssessment,
} = require("../Controllers/Instructor.controller");

// Instructor Routes
router.get("/courses", protectRoute,InstractorRoute, getInstructorCourses); // Get all courses assigned to the instructor
router.get("/courses/:courseId/students",InstractorRoute, protectRoute, getCourseStudents); // Get students enrolled in a specific course
router.post("/courses/:courseId/materials",InstractorRoute, protectRoute, uploadCourseMaterial); // Upload course material
router.post("/courses/:courseId/assessments",InstractorRoute, protectRoute, createAssessment); // Create an assessment
router.put("/assessments/:assessmentId/grade",InstractorRoute, protectRoute, gradeAssessment); // Grade an assessment

module.exports = router;