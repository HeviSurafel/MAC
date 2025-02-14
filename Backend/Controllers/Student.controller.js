const Course = require("../Model/Course.model");
const QRCode = require("qrcode");
const Student = require("../Model/Student.model");
const Assessment = require("../Model/Assesment.model");
const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: "Course not found",
  MATERIALS_NOT_FOUND: "No materials found for this course",
  ASSESSMENT_NOT_FOUND: "Assessment not found",
  ASSESSMENT_SUBMITTED: "Assessment submitted successfully",
  GRADES_NOT_FOUND: "No grades found",
};

// Get all courses enrolled by the student
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ studentsEnrolled: studentId }).populate(
      "instructors"
    );
    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Student Courses Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get course materials for a specific course
const getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }
    res.status(200).json(course.materials);
  } catch (error) {
    console.error("Get Course Materials Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Submit an assessment
const submitAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { fileUrl } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: ERROR_MESSAGES.ASSESSMENT_NOT_FOUND });
    }

    const studentSubmission = {
      student: req.user._id,
      fileUrl,
      submittedAt: Date.now(),
    };

    assessment.studentSubmissions.push(studentSubmission);
    await assessment.save();

    res.status(201).json({ message: ERROR_MESSAGES.ASSESSMENT_SUBMITTED, assessment });
  } catch (error) {
    console.error("Submit Assessment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// View grades for all assessments
const viewGrades = async (req, res) => {
  try {
    const studentId = req.user._id;
    const assessments = await Assessment.find({
      "studentSubmissions.student": studentId,
    }).select("title studentSubmissions");

    const grades = assessments.map((assessment) => {
      const submission = assessment.studentSubmissions.find(
        (sub) => sub.student.toString() === studentId
      );
      return {
        assessmentTitle: assessment.title,
        score: submission ? submission.score : "Not graded yet",
      };
    });

    res.status(200).json(grades);
  } catch (error) {
    console.error("View Grades Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const certificate = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch student details from the database (example)
    const student = await Student.findById(studentId).select(
      "name course grade"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create certification data (customize as needed)
    const certificationData = JSON.stringify({
      studentId: student._id,
      name: student.name,
      course: student.course,
      grade: student.grade,
      issuedAt: new Date().toISOString(),
    });

    // Generate QR code as a PNG image buffer
    const qrImage = await QRCode.toBuffer(certificationData, { type: "png" });

    // Set the response headers to indicate an image
    res.set("Content-Type", "image/png");
    res.send(qrImage); // Send the QR code image as the response
  } catch (error) {
    console.error("Error generating certificate QR code:", error);
    res.status(500).json({ message: "Error generating certificate QR code" });
  }
};
module.exports = {
  getStudentCourses,
  getCourseMaterials,
  submitAssessment,
  viewGrades,
  certificate
};