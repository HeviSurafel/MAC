const User=require('../Model/User.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const generateToken=async(id)=>{
    try{
        const RefreshToken=jwt.sign({id},process.env.RefreshTokenSecret);
        const AccessToken=jwt.sign({id},process.env.AccessTokenSecret);
        return {AccessToken,RefreshToken};
    }
    catch(err){
        console.log(err);
    }
}
const AdminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            const isMatch=await bcrypt.compare(password,user.password);
            if(isMatch){
                const {AccessToken,RefreshToken}=generateToken(user._id);
                res.status(401).json({user:{
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    id:user._id
                }},{AccessToken,RefreshToken});
            }
            else{
                res.send('Incorrect Password');
            }
        }
    }
    catch(err){
        res.send(err);
    }
}
const Logout=async(req,res)=>{
    try{
        res.send('Logout');
    }
    catch(err){
        res.send(err);
    }
}
const createAccountForStudent=async(req,res)=>{
    try{
        res.send('createAccountForStudent');
    }
    catch(err){
        res.send(err);
    }
    }

    const createAccountInstructor=async(req,res)=>{
        try{
            res.send('createAccountForStudent');
        }
        catch(err){
            res.send(err);
        }
        }  
          
module.exports={AdminLogin,createAccountForStudent,createAccountInstructor};