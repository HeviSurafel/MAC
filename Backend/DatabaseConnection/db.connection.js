const mongoose=require('mongoose');
const dbConnection=async()=>{
    try{
        const connection=await mongoose.connect(process.env.DB_HOST);
        console.log(`Database connected successfully on ${connection.connection.host}`);
    }
    catch(err){
        console.log(err);
    }
}
module.exports=dbConnection