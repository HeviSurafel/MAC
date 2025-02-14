const express = require("express");
const router = express.Router();
const { protectRoute } = require("../Middleware/Auth.middleware");
const {
  getAllCourses,
  getCourseDetails,
  getStudentProgress,
  updateCurriculum,
} = require("../Controller/AcademicDirector.controller");

// Academic Director Routes
router.get("/courses", protectRoute, getAllCourses); // Get all courses
router.get("/courses/:courseId", protectRoute, getCourseDetails); // Get details of a specific course
router.get("/students/:studentId/progress", protectRoute, getStudentProgress); // Get progress of a specific student
router.put("/curriculum", protectRoute, updateCurriculum); // Update the curriculum

module.exports = router;