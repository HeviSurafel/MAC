const express=require('express');
const router=express.Router();
const {StudentLogin}=require('../Controllers/Admin.controller');
router.post('/login',StudentLogin);
module.exports=router;