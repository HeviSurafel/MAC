const express=require('express');
const router=express.Router();
const upload  = require("../config/multerConfig");
const {  
    refreshToken,
    getProfile,
    getAllUser,
    requestPasswordReset,
    resetPassword}=require('../Controllers/Auth.controller');
const {protectRoute,adminRoute}=require('../Middleware/Protect.route');
const  AdminController=require('../Controllers/Admin.controller');
router.get("/dashboard",protectRoute,AdminController.getDashboard);
router.post('/users',protectRoute,adminRoute, AdminController.createUser); // Create a new user
router.get('/users',protectRoute, AdminController.getAllUsers); // Get all users
router.get('/users/:id',protectRoute,adminRoute, AdminController.getUserById); // Get a user by ID
router.put("/users/suspend/:id",protectRoute,adminRoute,AdminController.suspendUser);
router.put("/users/unsuspend/:id",protectRoute,adminRoute,AdminController.UnsuspendUser);
router.put('/users/:id',protectRoute,adminRoute, AdminController.updateUser); // Update a user
router.delete('/users/:id',protectRoute,adminRoute, AdminController.deleteUser); // Delete a user
router.post('/courses',protectRoute,adminRoute, AdminController.createCourse); // Create a new course
router.get('/courses', protectRoute,AdminController.getAllCourses);
router.get('/courses/:courseId/sections/:section/students/:batch',protectRoute,adminRoute, AdminController.getFilteredByCourseSectionAndBatch);
// Get all courses
router.get('/all/instructors',protectRoute,adminRoute, AdminController.getInstructors); // Get all courses by instructor
router.get('/courses/:id',protectRoute, AdminController.getCourseById); // Get a course by ID
router.put('/courses/:id',protectRoute,adminRoute, AdminController.updateCourse); // Update a course
router.delete('/courses/:id',protectRoute,adminRoute, AdminController.deleteCourse);
router.get("/student/feedback",protectRoute,adminRoute,AdminController.getFeedback);
router.delete("/student/feedback/delete/:id",protectRoute,adminRoute,AdminController.deleteFeedback);
router.get("/contact",protectRoute,adminRoute,AdminController.getcontactUs);
router.delete("/delete/contact/:id",protectRoute,adminRoute,AdminController.deleteContactUs);
router.get('/status/:studentId/:courseId',protectRoute, adminRoute, AdminController.checkPaymentStatus);
router.get('/student/unpaid/:courseId/:selectedBatch',protectRoute, adminRoute, AdminController.getUnpaidStudents);
router.post('/student/pay/:studentId/:courseId',protectRoute, adminRoute, AdminController.makePayment);
router.put("/course/reset-certificates/:courseId",protectRoute,adminRoute, AdminController.resetCertificationAndCourseStatus);
router.put("/student/updateGradeandRegenerateCerteficarte/:courseId/:section/:selectedBatch",protectRoute,adminRoute, AdminController.updateGradesAndGenerateCertificates);
router.post("/blog/post/create", upload.array("images", 10),protectRoute,adminRoute, AdminController.createBlog)
router.post("/blog/post/like/:id",protectRoute, AdminController.like)
router.put("/blog/post/update/:id",protectRoute,adminRoute, AdminController.updateBlog)
router.delete("/blog/post/delete/:id",protectRoute,adminRoute, AdminController.deleteBlog)
router.get("/blog/post/getblogs", AdminController.getBlogs)
router.get("/blog/post/detail/:id", AdminController.detailBlog)
router.get("/blog/post/detail/comment/:id",AdminController.getComments)
router.post("/blog/post/detail/create/comment/:id",protectRoute, AdminController.createComment)
module.exports=router;