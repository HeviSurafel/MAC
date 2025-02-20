const Course = require("../Model/Course.model");
const QRCode = require("qrcode");
const Student = require("../Model/Student.model");

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

// Submit an assessment (as assessments are now part of the Course model)
const submitAssessment = async (req, res) => {
  try {
    const { courseId, assessmentId } = req.params;
    const { fileUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    const assessment = course.assessments.id(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: ERROR_MESSAGES.ASSESSMENT_NOT_FOUND });
    }

    // Create the submission object
    const studentSubmission = {
      student: req.user._id,
      fileUrl,
      submittedAt: Date.now(),
    };

    // Push the submission to the specific assessment
    assessment.studentSubmissions.push(studentSubmission);
    await course.save();

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

    const courses = await Course.find({
      studentsEnrolled: studentId,
    });

    const grades = courses.flatMap((course) =>
      course.assessments.map((assessment) => {
        const submission = assessment.studentSubmissions.find(
          (sub) => sub.student.toString() === studentId
        );
        return {
          courseName: course.courseName,
          assessmentTitle: assessment.title,
          score: submission ? submission.score : "Not graded yet",
        };
      })
    );

    res.status(200).json(grades);
  } catch (error) {
    console.error("View Grades Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Generate certificate QR code
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
  certificate,
};
