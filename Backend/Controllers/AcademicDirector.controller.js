const Course = require("../Model/Course.model");
const User = require("../Model/User.model");
const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: "Course not found",
  STUDENT_NOT_FOUND: "Student not found",
  CURRICULUM_UPDATED: "Curriculum updated successfully",
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructors");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Get All Courses Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get details of a specific course
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("instructors")
      .populate("studentsEnrolled");
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Get Course Details Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get progress of a specific student
const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId).select("-password");
    if (!student) {
      return res.status(404).json({ message: ERROR_MESSAGES.STUDENT_NOT_FOUND });
    }

    const assessments = await Assessment.find({
      "studentSubmissions.student": studentId,
    }).select("title studentSubmissions");

    const progress = assessments.map((assessment) => {
      const submission = assessment.studentSubmissions.find(
        (sub) => sub.student.toString() === studentId
      );
      return {
        assessmentTitle: assessment.title,
        score: submission ? submission.score : "Not graded yet",
      };
    });

    res.status(200).json({ student, progress });
  } catch (error) {
    console.error("Get Student Progress Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update the curriculum
const updateCurriculum = async (req, res) => {
  try {
    const { courseId, updates } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    res.status(200).json({ message: ERROR_MESSAGES.CURRICULUM_UPDATED, course });
  } catch (error) {
    console.error("Update Curriculum Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllCourses,
  getCourseDetails,
  getStudentProgress,
  updateCurriculum,
};