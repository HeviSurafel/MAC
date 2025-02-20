const User = require("../Model/User.model");
const StudentRegistration = require("../Model/Student.model");
const Instructor = require("../Model/Instrator.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const AdminController = {
  // Create a new user (student or instructor)
  async createUser(req, res) {
    console.log(req.body);
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role = "student",
        status = "active",
        dateOfBirth,
        address,
        phoneNumber,
        department,
        courses = [], // List of course IDs
        section = '', // Single section value
      } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      // Construct the sectionAssignments array
      const sectionAssignments = courses.map(courseId => ({
        course: courseId,
        section: section, // Assuming you want to assign the same section to all courses
      }));
  console.log(sectionAssignments)
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        status,
        dateOfBirth,
        address,
        phoneNumber,
        department,
        sectionAssignments, // Pass the constructed sectionAssignments array
      });
 
     
  
      await user.save();
  
      // Instructor-specific logic
      if (role === "instructor") {
        const instructor = new Instructor({
          user: user._id,
          department,
          coursesTaught: sectionAssignments.map((s) => s.course),
        });
        await instructor.save();
  
        await Promise.all(
          sectionAssignments.map(async ({ courseId }) => {
            const course = await Course.findById(courseId);
            if (course && !course.instructors.includes(instructor._id)) {
              course.instructors.push(instructor._id);
              await course.save();
            }
          })
        );
      }
  
      // Student-specific logic
      if (role === "student") {
        await Promise.all(
          sectionAssignments.map(async ({ courseId }) => {
            const course = await Course.findById(courseId);
            if (course && !course.studentsEnrolled.includes(user._id)) {
              course.studentsEnrolled.push(user._id);
              await course.save();
            }
          })
        );
      }
  
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({ message: error.message });
    }
  }
  
,  

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "student") {
        await Course.updateMany(
          { studentsEnrolled: user._id },
          { $pull: { studentsEnrolled: user._id } }
        );
      }

      if (user.role === "instructor") {
        await Instructor.deleteOne({ user: user._id });
        await Course.updateMany(
          { instructors: user._id },
          { $pull: { instructors: user._id } }
        );
      }

      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Suspend user
  async suspendUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: "suspended" },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User suspended successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new course
  async createCourse(req, res) {
    try {
      const { title, courseCode, description, instructorName, status } = req.body;

      const instructor = await Instructor.findOne().populate({
        path: "user",
        match: { firstName: new RegExp(instructorName, "i") },
      });

      if (!instructor) {
        return res.status(400).json({ message: "Instructor not found" });
      }

      const course = new Course({
        courseName: title,
        courseCode,
        description,
        status,
        instructors: [instructor._id],
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
        .populate({ path: "instructors", populate: { path: "user", select: "firstName lastName email" } })
        .populate("studentsEnrolled");

      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Get course by ID
  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id)
        .populate("instructors")
        .populate("studentsEnrolled");
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Update course
  async updateCourse(req, res) {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Delete course
  async deleteCourse(req, res) {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Create instructor
  async createInstructor(req, res) {
    try {
      const { firstName, lastName, email, password, department } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists." });

      const user = new User({ firstName, lastName, email, password, role: "instructor", department });
      await user.save();

      const instructor = new Instructor({ user: user._id, department });
      await instructor.save();

      res.status(201).json({ message: "Instructor created successfully", instructor });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Get all instructors
  async getAllInstructors(req, res) {
    try {
      const instructors = await Instructor.find().populate("user");
      res.status(200).json(instructors);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Delete instructor
  async deleteInstructor(req, res) {
    try {
      const instructor = await Instructor.findByIdAndDelete(req.params.id);
      if (!instructor) return res.status(404).json({ message: "Instructor not found" });
      res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
};

module.exports = AdminController;