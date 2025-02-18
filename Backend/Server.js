const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Database = require("./DatabaseConnection/db.connection");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Correct CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Allow only your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Allow cookies and authentication headers
}));

// Routes
const AdminRoute = require('./Routes/Admin.route');
const InstractorRoute = require('./Routes/Instractor.route');
const StudentRoute = require('./Routes/Student.Route');
const AuthRoute = require('./Routes/Auth.route');

app.use('/api/auth', AuthRoute);
app.use('/api/', AdminRoute);
app.use('/api/', InstractorRoute);
app.use('/api/', StudentRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  Database().catch((err) => {
    console.error('Database connection error:', err);
  });
  console.log(`Server started on port ${PORT}`);
});
