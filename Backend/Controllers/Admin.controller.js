const User = require('../Model/User.model');
const StudentRegistration = require('../Model/Student.model');
const Instructor = require('../Model/Instrator.model');
const Course = require('../Model/Course.model');

const AdminController = {
  async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, role, dateOfBirth, address, phoneNumber, emergencyContact, course, department } = req.body;

      // Step 1: Create the user document
      const user = new User({ firstName, lastName, email, password, role });
      await user.save();

      let studentRegistration = null;
      let instructor = null;

      // Step 2: Create the student registration document if the role is student
      if (role === 'student') {
        studentRegistration = new StudentRegistration({
          student: user._id, // Linking to the created user
          dateOfBirth,
          address,
          phoneNumber,
          emergencyContact,
          course, // Linking to the chosen course
        });
        await studentRegistration.save();
      }

      // Step 3: Create the instructor document if the role is instructor
      if (role === 'instructor') {
        instructor = new Instructor({
          user: user._id, // Linking to the created user
          department,
          coursesTaught: course ? [course] : [], // Assign course(s) if provided
        });
        await instructor.save();
      }

      // Return the response based on the role
      const response = { user };

      if (role === 'student') {
        response.studentRegistration = studentRegistration;
      }

      if (role === 'instructor') {
        response.instructor = instructor;
      }

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
        return res.status(404).json({ message: 'User not found' });
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
        return res.status(404).json({ message: 'User not found' });
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
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Suspend a user
  async suspendUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: 'suspended' },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User suspended successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new course
  async createCourse(req, res) {
    try {
      const { courseName, courseCode, description, academicDirector, instructors } = req.body;

      const course = new Course({
        courseName,
        courseCode,
        description,
        academicDirector,
        instructors,
      });

      await course.save();

      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  // Get all courses
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find()
        .populate("academicDirector")
        .populate("instructors")
        .populate("studentsEnrolled");
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
        return res.status(404).json({ message: 'Course not found' });
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
      const { courseName, courseCode, description, academicDirector, instructors } = req.body;

      const course = await Course.findByIdAndUpdate(
        id,
        { courseName, courseCode, description, academicDirector, instructors },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course updated successfully', course });
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
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
};

module.exports = AdminController;
