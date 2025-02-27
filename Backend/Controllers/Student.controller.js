const Course = require("../Model/Course.model");
const QRCode = require("qrcode");
const Assessment= require("../Model/Assessment.model");
const User= require("../Model/User.model");
const Feedback=require("../Model/Feedback.model")
const path = require("path");
const Certificate = require("../Model/Certeficate.model");
const fs =require("fs");
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



const viewGrades = async (req, res) => {
  console.log(req.user);
  try {
    const studentId = req.user._id; // Extract student ID from authenticated user

    // Fetch student details
    const student = await User.findById(studentId).select("firstName lastName");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Find courses enrolled by the student
    const enrolledCourses = await Course.find({ studentsEnrolled: studentId })
      .select("courseName courseCode")
      .lean();

    if (!enrolledCourses.length) {
      return res.status(404).json({ message: "No enrolled courses found." });
    }

    // Fetch all assessments where the student has grades
    const assessments = await Assessment.find({ "studentResults.student": studentId })
      .populate("course", "courseName courseCode")
      .lean();

    // Map assessments to display student grades per course
    const grades = assessments.map((assessment) => {
      const studentResult = assessment.studentResults.find((result) =>
        result.student.toString() === studentId.toString()
      );

      return {
        courseId: assessment.course._id,
        courseName: assessment.course.courseName,
        courseCode: assessment.course.courseCode,
        assignmentScore: studentResult.assignmentScore,
        examScore: studentResult.examScore,
        finalScore: studentResult.finalScore,
      };
    });

    return res.status(200).json({
      student: {
        id: studentId,
        firstName: student.firstName,
        lastName: student.lastName,
      },
      enrolledCourses,
      grades,
    });
  } catch (error) {
    console.error("Error fetching student grades:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
// Generate certificate QR code
const getcerteficate = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // Check if certificate exists in the database
    const certificate = await Certificate.findOne({ student: studentId });
    if (!certificate) {
      return res.status(404).json({ message: "No certificate found for this student." });
    }

    // Path to the certificate file
    const certificatePath = path.join(__dirname, "../certificates", `${studentId}.pdf`);

    if (!fs.existsSync(certificatePath)) {
      return res.status(404).json({ message: "Certificate file not found." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${studentId}.pdf"`);
    return res.sendFile(certificatePath);
  } catch (error) {
    console.error("Certificate Retrieval Error:", error);
    res.status(500).json({ message: "Error retrieving certificate" });
  }
};
const submitFeedback = async (req, res) => {
  console.log(req.body);
  try {
    const { comment } = req.body; // Only extract existing fields
    const student = req.user._id; // Get student ID from authentication

    if (!comment) {
      return res.status(400).json({ message: "Comment is required." });
    }

    const feedback = new Feedback({ student, comment });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully.", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getStudentCourses,
  viewGrades,
  getcerteficate,
  submitFeedback
};