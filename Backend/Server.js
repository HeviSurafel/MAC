const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const Database = require("./DatabaseConnection/db.connection");
const multer = require("multer"); // Import multer

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

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify the folder where files should be uploaded
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with a unique name
    },
});

const upload = multer({ storage: storage });

// Routes
const AdminRoute = require('./Routes/Admin.route');
const InstractorRoute = require('./Routes/Instractor.route');
const StudentRoute = require('./Routes/Student.Route');
const AuthRoute = require('./Routes/Auth.route');

app.use('/api/auth', AuthRoute);
app.use('/api/', AdminRoute);
app.use('/api/', InstractorRoute);
app.use('/api/', StudentRoute);

// Example route for creating a blog with image upload
app.post('/api/blogs', upload.array('images', 10), async (req, res) => {
    // Create your blog with the files from req.files
   // Logs the uploaded files

    try {
        // Your blog creation logic
        const { title, subdescription, description } = req.body;
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const blog = await Blog.create({
            title,
            subdescription,
            description,
            images,
            user: req.user._id,
        });

        res.status(201).json(blog);
    } catch (error) {
        console.error("Error in creating blog:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  Database().catch((err) => {
    console.error('Database connection error:', err);
  });
  console.log(`Server started on port ${PORT}`);
});
