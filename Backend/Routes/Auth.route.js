const express = require("express");
const router = express.Router();
const {protectRoute,adminRoute}=require("../Middleware/Protect.route")
const { signup,login,logout,ContactUs,updateProfile,refreshToken, getProfile,updatePassword,getAllUser,requestPasswordReset } = require("../Controllers/Auth.controller");
router.post("/signup",signup);
router.post("/login", login);
router.post("/logout",logout);
router.post("/refreshtoken",refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/reset-password", requestPasswordReset);
router.put("/update-password", protectRoute, updatePassword);
router.get("/alluser",protectRoute,adminRoute,getAllUser);
router.put("/updateprofile",protectRoute,updateProfile);
router.post("/contactUs",ContactUs);

module.exports = router;