const User = require("../Model/User.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const Section = require("../Model/Section.model"); // Import the Section model

const AdminController = {
  async createUser(req, res) {
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
        section = '' // Single section value or comma-separated sections
      } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      const sections = section ? section.split(',').map(s => s.trim()) : [];
  
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
      });
  
      await user.save();
  
      for (let i = 0; i < courses.length; i++) {
        const courseId = courses[i];
        const sectionName = sections[i] || 'A';
  
        let existingSection = await Section.findOne({ course: courseId, section: sectionName });
  
        if (!existingSection) {
          existingSection = new Section({ course: courseId, section: sectionName, students: [] });
          await existingSection.save();
        }
  
        if (role === "student") {
          existingSection.students.push(user._id);
          await existingSection.save();
  
          const course = await Course.findById(courseId);
          if (course && !course.studentsEnrolled.includes(user._id)) {
            course.studentsEnrolled.push(user._id);
            await course.save();
          }
        }
      }
  
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "student") {
        await Course.updateMany({ studentsEnrolled: user._id }, { $pull: { studentsEnrolled: user._id } });
      }

      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async createCourse(req, res) {
    try {
      const { title, courseCode, description, subDescription, status } = req.body;
      const course = new Course({
        courseName: title,
        courseCode,
        description,
        subDescription,
        status,
        studentsEnrolled: [],
      });
  
      await course.save();
      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async getAllCourses(req, res) {
    try {
      const courses = await Course.find().populate("studentsEnrolled");
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id).populate("studentsEnrolled");
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async updateCourse(req, res) {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async deleteCourse(req, res) {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
};

module.exports = AdminController;
