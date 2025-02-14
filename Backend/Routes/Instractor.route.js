const express=require('express');
const router=express.Router();
const {InstractorLogin}=require('../Controllers/Admin.controller');
router.post('/login',InstractorLogin);
module.exports=router;