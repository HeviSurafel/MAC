const express=require('express');
const router=express.Router();
const {AdminLogin}=require('../Controllers/Admin.controller');
router.post('/login',AdminLogin);
module.exports=router;