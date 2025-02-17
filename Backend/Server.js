const express=require("express")
const app=express();
const dotenv=require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const Database=require("./DatabaseConnection/db.connection")
app.use(cors({
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies to be sent
  }));
app.use(bodyParser.urlencoded({extended:true}));
// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data


// Routes
const AdminRoute = require('./Routes/Admin.route');
const InstractorRoute = require('./Routes/Instractor.route');
const StudentRoute = require('./Routes/Student.Route');
const AuthRoute = require('./Routes/Auth.route');

app.use('/api/auth', AuthRoute);
app.use('/api/admin', AdminRoute);
app.use('/api/instractor', InstractorRoute);
app.use('/api/student', StudentRoute);

// Start Server
const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not set
app.listen(PORT, () => {
  Database().catch((err) => {
    console.error('Database connection error:', err);
  });
  console.log(`Server started on port ${PORT}`);
});