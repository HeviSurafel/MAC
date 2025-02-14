const express=require('express');
const app=express();
const dotenv=require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const Database=require("./DatabaseConnection/db.connection")
app.use(cors());
const PORT=process.env.PORT;
app.use(bodyParser.urlencoded({extended:true}));
const AdminRoute=require("./Routes/Admin.route");
const InstractorRoute=require("./Routes/Instractor.route");
const StudentRoute=require("./Routes/Student.Route");
const AuthRoute=require("./Routes/Auth.route");
app.use('/api/auth',AuthRoute);
app.use('/api',AdminRoute);
app.use('/api',InstractorRoute);
app.use('/api',StudentRoute);
app.listen(PORT,()=>{
    Database(),
    console.log(`Server started on port ${PORT}`);
});
