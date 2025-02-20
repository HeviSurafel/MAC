const express = require("express");
const { submitFeedback, getCourseFeedback, getInstructorFeedback } = require('../Controllers/Feedback');
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
router.get("/certificate/:studentId", protectRoute, certeficate);
router.post('/submit', protectRoute, submitFeedback); // 🚀 Submit feedback (Student only)
router.get('/course/:courseId', protectRoute, getCourseFeedback); // 📥 View course feedback
router.get('/instructor/:instructorId', protectRoute, getInstructorFeedback); // 📊 Instructor feedback summary
module.exports = router; // View grades for all assessments
module.exports = router;