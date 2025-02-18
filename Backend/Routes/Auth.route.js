const express = require("express");
const router = express.Router();
const {protectRoute,adminRoute}=require("../Middleware/Protect.route")
const { signup,login,logout,refreshToken, getProfile,getAllUser } = require("../Controllers/Auth.controller");
router.post("/signup",signup);
router.post("/login", login);
router.post("/logout",protectRoute,logout);
router.post("/refresh-token",refreshToken);
router.get("/profile", protectRoute, getProfile);
router.get("/alluser",protectRoute,adminRoute,getAllUser);
module.exports = router;