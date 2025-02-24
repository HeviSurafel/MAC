const express = require("express");
const { submitFeedback, viewGrades, getcerteficate } = require('../Controllers/Student.controller');
const router = express.Router();
const { protectRoute } = require("../Middleware/Protect.route");
router.get("/student/grades", protectRoute, viewGrades); 
router.get("/student/certificate/:studentId", protectRoute, getcerteficate);
router.post('/student/submit', protectRoute, submitFeedback); // 🚀 Submit feedback (Student only) // 📥 View course feedback
module.exports = router; // View grades for all assessments