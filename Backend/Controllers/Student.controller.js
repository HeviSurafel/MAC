const Course = require("../Model/Course.model");
const QRCode = require("qrcode");

const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: "Course not found",
  MATERIALS_NOT_FOUND: "No materials found for this course",
  ASSESSMENT_NOT_FOUND: "Assessment not found",
  ASSESSMENT_SUBMITTED: "Assessment submitted successfully",
  GRADES_NOT_FOUND: "No grades found",
  STUDENT_NOT_FOUND: "Student not found",
  QR_GENERATION_ERROR: "Error generating certificate QR code",
};

// Get all courses enrolled by the student
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ studentsEnrolled: studentId }).populate("instructors");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Student Courses Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get course materials
const getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    res.status(200).json(course.materials || []);
  } catch (error) {
    console.error("Get Course Materials Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit an assessment
const submitAssessment = async (req, res) => {
  try {
    const { courseId, assessmentId } = req.params;
    const { fileUrl } = req.body;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });

    const assessment = course.assessments.id(assessmentId);
    if (!assessment) return res.status(404).json({ message: ERROR_MESSAGES.ASSESSMENT_NOT_FOUND });

    // Push the student's submission
    assessment.studentSubmissions.push({ student: studentId, fileUrl, submittedAt: Date.now() });
    await course.save();

    res.status(201).json({ message: ERROR_MESSAGES.ASSESSMENT_SUBMITTED, assessment });
  } catch (error) {
    console.error("Submit Assessment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// View grades for all assessments
const viewGrades = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ studentsEnrolled: studentId });

    const grades = courses.flatMap(course =>
      course.assessments.map(assessment => {
        const submission = assessment.studentSubmissions.find(sub => sub.student.toString() === studentId);
        return {
          courseName: course.courseName,
          assessmentTitle: assessment.title,
          score: submission ? submission.score : "Not graded yet",
        };
      })
    );

    res.status(200).json(grades.length ? grades : { message: ERROR_MESSAGES.GRADES_NOT_FOUND });
  } catch (error) {
    console.error("View Grades Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate certificate QR code
const certificate = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Course.findOne({ studentsEnrolled: studentId }).populate("studentsEnrolled");

    if (!student) return res.status(404).json({ message: ERROR_MESSAGES.STUDENT_NOT_FOUND });

    const certificationData = JSON.stringify({
      studentId,
      name: student.studentsEnrolled.name,
      courses: student.courseName,
      issuedAt: new Date().toISOString(),
    });

    const qrImage = await QRCode.toBuffer(certificationData, { type: "png" });
    res.set("Content-Type", "image/png");
    res.send(qrImage);
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    res.status(500).json({ message: ERROR_MESSAGES.QR_GENERATION_ERROR });
  }
};

module.exports = {
  getStudentCourses,
  getCourseMaterials,
  submitAssessment,
  viewGrades,
  certificate,
};