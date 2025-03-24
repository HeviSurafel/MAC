const express = require("express");
const router = express.Router();
const { protectRoute, InstractorRoute, adminRoute } = require("../Middleware/Protect.route");
const {
  getInstructorCoursesAndStudents,
  getCourseStudentsBySection,
  updateAllAssessments,
  generateCertificates,
  markCourseAsCompleted,
  getCourseStatus,
  getInstructorCourses
} = require("../Controllers/Instructor.controller");
getCourseStudentsBySection
// Instructor Routes
router.get("/instructor/courses", protectRoute, InstractorRoute  , getInstructorCourses)
router.get("/instructor/courses/:courseId/section/:batchId", protectRoute, InstractorRoute  , getInstructorCoursesAndStudents);
router.get(
  `/instructor/courses/:courseId/:section/students/:selectedBatch`,
  protectRoute,
  InstractorRoute,
  getCourseStudentsBySection
);
router.put("/instructor/assessments/updateAll/:courseId/:section", protectRoute, InstractorRoute, updateAllAssessments);
router.post("/instructor/certificates/generate/:courseId", protectRoute, InstractorRoute, generateCertificates);
router.put("/instructor/courses/:courseId/sections/:section/complete", protectRoute, InstractorRoute, markCourseAsCompleted);
router.get("/instructor/courses/:courseId/sections/:section/status", protectRoute, InstractorRoute, getCourseStatus);

module.exports = router;