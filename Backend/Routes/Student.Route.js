const express = require("express");
const router = express.Router();
const { protectRoute } = require("../Middleware/Protect.route");
const {
  getStudentCourses,
  getCourseMaterials,
  submitAssessment,
  viewGrades,
  certificate: certeficate
} = require("../Controllers/Student.controller");

// Student Routes
router.get("/courses", protectRoute, getStudentCourses); // Get all courses enrolled by the student
router.get("/courses/:courseId/materials", protectRoute, getCourseMaterials); // Get course materials for a specific course
router.post("/assessments/:assessmentId/submit", protectRoute, submitAssessment); // Submit an assessment
router.get("/grades", protectRoute, viewGrades); // View grades for all assessments
router.get("/certificate/:studentId", protectRoute, certeficate); // View grades for all assessments
module.exports = router;