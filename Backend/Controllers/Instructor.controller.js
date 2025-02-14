const Course = require("../Model/Course.model");
const Assessment = require("../Model/Assesment.model");
const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: "Course not found",
  STUDENTS_NOT_FOUND: "No students found for this course",
  MATERIAL_UPLOADED: "Course material uploaded successfully",
  ASSESSMENT_CREATED: "Assessment created successfully",
  ASSESSMENT_GRADED: "Assessment graded successfully",
};

// Get all courses assigned to the instructor
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ instructors: instructorId }).populate(
      "academicDirector"
    );
    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Instructor Courses Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get students enrolled in a specific course
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("studentsEnrolled");
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }
    res.status(200).json(course.studentsEnrolled);
  } catch (error) {
    console.error("Get Course Students Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Upload course material
const uploadCourseMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, fileUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    course.materials.push({ title, description, fileUrl });
    await course.save();

    res.status(201).json({ message: ERROR_MESSAGES.MATERIAL_UPLOADED, course });
  } catch (error) {
    console.error("Upload Course Material Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Create an assessment
const createAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxScore } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    const assessment = new Assessment({
      course: courseId,
      instructor: req.user._id,
      title,
      description,
      dueDate,
      maxScore,
    });
    await assessment.save();

    res.status(201).json({ message: ERROR_MESSAGES.ASSESSMENT_CREATED, assessment });
  } catch (error) {
    console.error("Create Assessment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Grade an assessment
const gradeAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { studentId, score } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const studentSubmission = assessment.studentSubmissions.find(
      (submission) => submission.student.toString() === studentId
    );
    if (!studentSubmission) {
      return res.status(404).json({ message: "Student submission not found" });
    }

    studentSubmission.score = score;
    await assessment.save();

    res.status(200).json({ message: ERROR_MESSAGES.ASSESSMENT_GRADED, assessment });
  } catch (error) {
    console.error("Grade Assessment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getInstructorCourses,
  getCourseStudents,
  uploadCourseMaterial,
  createAssessment,
  gradeAssessment,
};