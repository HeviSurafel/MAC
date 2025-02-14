const User = require('../Model/User.model');
const AdminController = {
  // Create a new user (admin, instructor, or student)
  async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, role } = req.body;
      const user = new User({ firstName, lastName, email, password, role });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Create a new instructor
  async createInstructor(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const instructor = new User({ firstName, lastName, email, password, role: 'instructor' });
      await instructor.save();
      res.status(201).json(instructor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Create a new student
  async createStudent(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const student = new User({ firstName, lastName, email, password, role: 'student' });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
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
  async createCourse (req, res) {
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
  
      res.status(201).json({ message: ERROR_MESSAGES.COURSE_CREATED, course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async getAllCourses (req, res) {
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
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id)
        .populate("academicDirector")
        .populate("instructors")
        .populate("studentsEnrolled");
      if (!course) {
        return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error("Get Course By ID Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async updateCourse (req, res) {
    try {
      const { id } = req.params;
      const { courseName, courseCode, description, academicDirector, instructors } = req.body;
  
      const course = await Course.findByIdAndUpdate(
        id,
        { courseName, courseCode, description, academicDirector, instructors },
        { new: true }
      );
  
      if (!course) {
        return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
      }
  
      res.status(200).json({ message: ERROR_MESSAGES.COURSE_UPDATED, course });
    } catch (error) {
      console.error("Update Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async deleteCourse (req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);
  
      if (!course) {
        return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
      }
  
      res.status(200).json({ message: ERROR_MESSAGES.COURSE_DELETED });
    } catch (error) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

module.exports = AdminController;