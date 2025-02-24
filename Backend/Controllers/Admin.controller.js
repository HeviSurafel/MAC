const User = require("../Model/User.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const Section = require("../Model/Section.model"); // Import the Section model
const Assessment = require("../Model/Assessment.model");
const Feedback=require("../Model/Feedback.model")
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
        courses = [],
        section = "",
      } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already exists." });

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
        const sectionName = section.split(",")[i] || "A";

        let existingSection = await Section.findOne({
          course: courseId,
          section: sectionName,
        });
        if (!existingSection) {
          existingSection = new Section({
            course: courseId,
            section: sectionName,
            students: [],
            instructors: [],
          });
          await existingSection.save();
        }

        const course = await Course.findById(courseId);
        if (!course) continue; // Skip if course doesn't exist

        if (role === "student") {
          // ✅ Add student to section
          existingSection.students.push(user._id);
          await existingSection.save();

          // ✅ Add student to the course
          if (!course.studentsEnrolled.includes(user._id)) {
            course.studentsEnrolled.push(user._id);
            await course.save();
          }

          // ✅ Handle assessments
          let existingAssessment = await Assessment.findOne({
            course: courseId,
            section: existingSection._id,
          });
          if (!existingAssessment) {
            existingAssessment = new Assessment({
              course: courseId,
              section: existingSection._id,
              examWeight: 0,
              assignmentWeight: 0,
              finalWeight: 0,
              studentResults: [],
            });
          }

          // ✅ Add student to assessment if not already added
          const studentExists = existingAssessment.studentResults.some(
            (result) => result.student.equals(user._id)
          );
          if (!studentExists) {
            existingAssessment.studentResults.push({
              student: user._id,
              assignmentScore: 0,
              examScore: 0,
              finalScore: 0,
            });
          }

          await existingAssessment.save();
        } else if (role === "instructor") {
          // ✅ Add instructor to section
          if (!existingSection.instructors.includes(user._id)) {
            existingSection.instructors.push(user._id);
            await existingSection.save();
          }

          // ✅ Add instructor to course
          if (!course.instructors.includes(user._id)) {
            await Course.findByIdAndUpdate(
              courseId,
              { $push: { instructors: user._id } },
              { new: true }
            );
          }
        }
      }

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Error creating user:", error);
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
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

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

      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async createCourse(req, res) {
    try {
      const { title, courseCode, description, subDescription, status } =
        req.body;
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
      console.log("Received Query Params:", req.query);
  
      const { courseId, section } = req.query;
  
      let query = {};
      if (courseId) query._id = new mongoose.Types.ObjectId(courseId);
  
      let studentFilter = {}; // Store student filtering condition
      let studentAssessments = {}; // Store student assessment scores
  
      if (section) {
        // Find the section document with students
        const sectionDoc = await Section.findOne({
          course: courseId,
          section: section.trim(),
        });
  
        if (!sectionDoc) {
          return res.status(404).json({ message: "No section found for this course!" });
        }
  
        const studentIds = sectionDoc.students.map((id) => new mongoose.Types.ObjectId(id));
        studentFilter["_id"] = { $in: studentIds }; // Filter only students from the section
  
        // Fetch student assessments for the selected course and section
        const assessments = await Assessment.findOne({
          course: courseId,
          section: sectionDoc._id,
        });
  
        if (assessments) {
          assessments.studentResults.forEach((result) => {
            studentAssessments[result.student.toString()] = {
              assignmentScore: result.assignmentScore ?? 0,
              examScore: result.examScore ?? 0,
              finalScore: result.finalScore ?? 0,
            };
          });
        }
      }
  
 
      const courses = await Course.find(query)
        .populate({
          path: "studentsEnrolled",
          match: studentFilter, // Apply student filtering condition
          select: "firstName lastName email",
        })
        .populate("instructors", "firstName lastName email");
  
      // Attach assessment scores to students
      const coursesWithAssessments = courses.map((course) => {
        return {
          ...course.toObject(),
          studentsEnrolled: course.studentsEnrolled.map((student) => {
            return {
              ...student.toObject(),
              assignmentScore: studentAssessments[student._id.toString()]?.assignmentScore ?? 0,
              examScore: studentAssessments[student._id.toString()]?.examScore ?? 0,
              finalScore: studentAssessments[student._id.toString()]?.finalScore ?? 0,
            };
          }),
        };
      });
  
      res.status(200).json(coursesWithAssessments);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  
,  
  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id).populate(
        "studentsEnrolled"
      );
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async updateCourse(req, res) {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
   async getFeedback (req, res){
    try {
      const feedback = await Feedback.find();
      res.status(200).json(feedback); // ✅ Use 200 for GET responses
    } catch (error) {
      console.error("Error fetching feedback:", error); // ✅ Log error for debugging
      res.status(500).json({ message: "Failed to retrieve feedback. Please try again later." }); // ✅ Generic error message
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
