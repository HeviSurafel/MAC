const User = require("../Model/User.model");
const StudentRegistration = require("../Model/Student.model");
const Instructor = require("../Model/Instrator.model");
const Course = require("../Model/Course.model");

const AdminController = {
  async createUser(req, res) {
    try {
      console.log(req.body);
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        status,
        dateOfBirth,
        address,
        phoneNumber,
        emergencyContact,
        courses, // This should be an array of course IDs
        department,
      } = req.body;

      // Step 1: Create the user document
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        status, // Ensure we include the user's status
        dateOfBirth,
        address,
        phoneNumber,
      });
      await user.save();

      let studentRegistration = null;
      let instructor = null;

      // Step 2: If the role is student, link to multiple courses
      if (role === "student") {
        studentRegistration = new StudentRegistration({
          student: user._id, // Linking to the created user
          courses, // Linking to multiple courses
        });
        await studentRegistration.save();

        // Add student to each course's `studentsEnrolled` array
        for (const courseId of courses) {
          const course = await Course.findById(courseId);
          if (course) {
            course.studentsEnrolled.push(user._id);
            await course.save();
          }
        }
      }

      // Step 3: If the role is instructor, link to multiple courses
      if (role === "instructor") {
        instructor = new Instructor({
          user: user._id,
          department,
          coursesTaught: courses, // Linking to multiple courses
        });
        await instructor.save();

        // Add instructor to each course's `instructors` array
        for (const courseId of courses) {
          const course = await Course.findById(courseId);
          if (course) {
            course.instructors.push(instructor._id);
            await course.save();
          }
        }
      }

      const response = { user };

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const { firstName, lastName, email, role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, email, role },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Suspend a user
  async suspendUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: "suspended" },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User suspended successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new course

  async createCourse(req, res) {
    console.log(req.body);
    try {
      const {
        title,
        description,
        subDescription,
        instructorName,
        status,
        courseCode,
      } = req.body;

      // Ensure instructorName is provided and is a string
      if (!instructorName || typeof instructorName !== "string") {
        return res
          .status(400)
          .json({ message: "Instructor name must be a valid string" });
      }

      // Find the instructor by user's firstName (case insensitive)
      const instructor = await Instructor.findOne().populate({
        path: "user",
        match: { firstName: new RegExp(instructorName, "i") }, // Case-insensitive search
      });

      // Check if an instructor was found
      if (!instructor || !instructor.user) {
        return res.status(400).json({ message: "Instructor not found" });
      }

      // Create the course with the instructor's ID
      const course = new Course({
        courseName: title,
        courseCode: courseCode,
        description: description,
        status,
        instructors: [instructor._id], // Store instructor ID
      });

      await course.save();

      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Get all courses
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find()
        .populate({
          path: "instructors",
          populate: {
            path: "user", // This will get the user data inside instructors
            select: "firstName lastName email", // Only fetch necessary fields
          },
        })
        .populate("studentsEnrolled"); // No need to populate "user" directly

      res.status(200).json(courses);
    } catch (error) {
      console.error("Get All Courses Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Get a course by ID
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id)
        .populate("academicDirector")
        .populate("instructors")
        .populate("studentsEnrolled");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error("Get Course By ID Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Update a course
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const {
        courseName,
        courseCode,
        description,
        academicDirector,
        instructors,
      } = req.body;

      const course = await Course.findByIdAndUpdate(
        id,
        { courseName, courseCode, description, academicDirector, instructors },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      console.error("Update Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Delete a course
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async createInstructor(req, res) {
    try {
      const { firstName, lastName, email, password, department } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role: "instructor", // Set the role as 'instructor'
      });

      // Save the User document
      await newUser.save();

      // Create a new Instructor document by referencing the created User
      const newInstructor = new Instructor({
        user: newUser._id, // Reference to the newly created User
        department,
      });

      // Save the Instructor document
      await newInstructor.save();

      res.status(201).json({
        message: "Instructor created successfully",
        instructor: newInstructor,
      });
    } catch (error) {
      console.error("Error creating instructor:", error);
      res.status(500).json({
        message: "Something went wrong while creating the instructor.",
      });
    }
  },
  async getAllInstructors(req, res) {
    try {
      const instructors = await Instructor.find().populate("user");
      res.status(200).json(instructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res
        .status(500)
        .json({ message: "Something went wrong while fetching instructors." });
    }
  },
  async deleteInstructor(req, res) {
    try {
      const { id } = req.params;
      const instructor = await Instructor.findByIdAndDelete(id);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      res
        .status(500)
        .json({
          message: "Something went wrong while deleting the instructor.",
        });
    }
  },
};

module.exports = AdminController;
