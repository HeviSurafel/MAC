const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    oldPassword:{type:String,default:null},
    role:{type:String,required:true, enum:['Admin','Instractor','Student']},
    status:{type:String,required:true},
    
},{
    timestamps:true
});
module.exports=mongoose.model('User',UserSchema);