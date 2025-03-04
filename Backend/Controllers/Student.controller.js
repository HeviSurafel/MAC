const Course = require("../Model/Course.model");
const QRCode = require("qrcode");
const Assessment= require("../Model/Assessment.model");
const User= require("../Model/User.model");
const Feedback=require("../Model/Feedback.model")
const path = require("path");
const Certificate = require("../Model/Certeficate.model");
const fs =require("fs");
const asyncHandler = require("express-async-handler");
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
const getStudentCourses = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user._id;
    const courses = await Course.find({ studentsEnrolled: studentId }).populate("instructors");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Get Student Courses Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



const viewGrades = asyncHandler(async (req, res) => {
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
});

const getcerteficate =asyncHandler( async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // ✅ Find the most recent certificate for the student
    const certificate = await Certificate.findOne({ student: studentId })
      .populate("course", "courseName") // Get course name
      .sort({ issuedAt: -1 });

    if (!certificate) {
      return res.status(404).json({ message: "No certificate found for this student." });
    }

    // ✅ Dynamically generate the file path
    const sanitizedCourseName = certificate.course.courseName.replace(/\s+/g, "_");
    const certificateFileName = `${studentId}_${sanitizedCourseName}.pdf`;
    const certificatePath = path.join(__dirname, "../certificates", certificateFileName);

    // ✅ Ensure the file exists before sending
    if (!fs.existsSync(certificatePath)) {
      return res.status(404).json({ message: "Certificate file not found." });
    }

    // ✅ Send the PDF file to the frontend
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${certificateFileName}"`);
    return res.sendFile(path.resolve(certificatePath)); // Ensures absolute path
  } catch (error) {
    console.error("Certificate Retrieval Error:", error);
    res.status(500).json({ message: "Error retrieving certificate" });
  }
});

const submitFeedback =asyncHandler( async (req, res) => {
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
});

module.exports = {
  getStudentCourses,
  viewGrades,
  getcerteficate,
  submitFeedback
};