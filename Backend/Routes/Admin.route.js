const express=require('express');
const router=express.Router();
const {  
    refreshToken,
    getProfile,
    getAllUser,
    requestPasswordReset,
    resetPassword}=require('../Controllers/Auth.controller');
const {protectRoute,adminRoute}=require('../Middleware/Protect.route');
const  AdminController=require('../Controllers/Admin.controller');
router.post('/users',protectRoute,adminRoute, AdminController.createUser); // Create a new user
router.get('/users',protectRoute, AdminController.getAllUsers); // Get all users
router.get('/users/:id',protectRoute,adminRoute, AdminController.getUserById); // Get a user by ID
router.put('/users/:id',protectRoute,adminRoute, AdminController.updateUser); // Update a user
router.delete('/users/:id',protectRoute,adminRoute, AdminController.deleteUser); // Delete a user
router.post('/courses',protectRoute,adminRoute, AdminController.createCourse); // Create a new course
router.get('/courses', protectRoute,AdminController.getAllCourses); // Get all courses
router.get('/courses/:id',protectRoute,adminRoute, AdminController.getCourseById); // Get a course by ID
router.put('/courses/:id',protectRoute,adminRoute, AdminController.updateCourse); // Update a course
router.delete('/courses/:id',protectRoute,adminRoute, AdminController.deleteCourse);
// router.post('/instructors',protectRoute,adminRoute, AdminController.createInstructor); 
// router.get('/instructors',protectRoute, AdminController.getAllInstructors);
// router.delete('/instructors/:id',protectRoute,adminRoute, AdminController.deleteInstructor);
// Create a new instructor
 // Get all instructors
module.exports=router;