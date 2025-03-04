const Course = require("../Model/Course.model");
const Section = require("../Model/Section.model");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const Assessment = require("../Model/Assessment.model");
const generateCertificatePDF = require("../config/generateCertificatePDF");
const Certificate = require("../Model/Certeficate.model");
const markCourseAsCompleted = asyncHandler(async (req, res) => {
  try {
    const { courseId, section } = req.params;
    const { status } = req.body;

    if (!courseId || !section || !status) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    const sectionData = await Section.findOne({ course: courseId, section });
    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    sectionData.status = status; // "completed"
    await sectionData.save();

    res
      .status(200)
      .json({ message: "Course section marked as completed.", sectionData });
  } catch (error) {
    console.error("Error marking course as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getInstructorCoursesAndStudents = asyncHandler(async (req, res) => {
  try {
    const instructorId = req.user._id;
    const sections = await Section.find({ instructors: instructorId })
      .populate({
        path: "course",
        select: "courseName courseCode courseStatus",
      })
      .populate({
        path: "students",
        select: "firstName lastName email studentId",
      });

    if (!sections.length) {
      return res
        .status(404)
        .json({ message: "No sections found for this instructor." });
    }

    const coursesWithStudents = sections.map((section) => ({
      courseId: section.course._id,
      courseName: section.course.courseName,
      courseStatus: section.course.courseStatus,
      section: section.section,
      students: section.students.map((student) => ({
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      })),
    }));

    res.status(200).json(coursesWithStudents);
  } catch (error) {
    console.error("Error fetching instructor courses and students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCourseStudentsBySection = asyncHandler(async (req, res) => {
  try {
    const { courseId, section } = req.params;
    if (!courseId || !section) {
      return res
        .status(400)
        .json({ message: "Course ID and section are required." });
    }

    const sectionData = await Section.findOne({
      course: courseId,
      section: section,
    }).populate({
      path: "students",
      select: "firstName lastName email studentId",
    });

    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    const assessment = await Assessment.findOne({
      course: courseId,
      section: sectionData._id,
    });
    if (!assessment) {
      return res
        .status(404)
        .json({ message: "No assessment found for this section." });
    }

    const studentsWithAssessment = sectionData.students.map((student) => {
      const studentAssessment = assessment.studentResults.find(
        (sr) => sr.student.toString() === student._id.toString()
      );

      return {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentId: student.studentId,
        assignmentScore: studentAssessment?.assignmentScore || 0,
        examScore: studentAssessment?.examScore || 0,
        finalScore: studentAssessment?.finalScore || 0,
      };
    });

    res.status(200).json({
      course: courseId,
      section: section,
      students: studentsWithAssessment,
    });
  } catch (error) {
    console.error("Error fetching students by course and section:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateAllAssessments = asyncHandler(async (req, res) => {
  try {
    const { courseId, section } = req.params;
    const { assessments } = req.body;

    if (!courseId || !section || !Array.isArray(assessments)) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    const sectionData = await Section.findOne({ course: courseId, section });
    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    let assessment = await Assessment.findOne({
      course: courseId,
      section: sectionData._id,
    });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    assessment.studentResults = assessment.studentResults.map(
      (studentAssessment) => {
        let updatedStudent = assessments.find(
          (s) => s.studentId === studentAssessment.student.toString()
        );
        if (updatedStudent) {
          studentAssessment.assignmentScore =
            Number(updatedStudent.assignmentScore) || 0;
          studentAssessment.examScore = Number(updatedStudent.examScore) || 0;
          studentAssessment.finalScore = Number(updatedStudent.finalScore) || 0;
        }
        return studentAssessment;
      }
    );

    await assessment.save();
    res
      .status(200)
      .json({ message: "Assessments updated successfully", assessment });
  } catch (error) {
    console.error("Error updating assessments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const generateCertificates =asyncHandler( async (req, res) => {
  try {
    const { courseId } = req.params;
    const { students } = req.body;

    if (!courseId) return res.status(400).json({ message: "Course ID is required." });
    if (!students || students.length === 0)
      return res.status(400).json({ message: "No students provided." });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const certificates = await Promise.all(
      students.map(async (student) => {
        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
          student: student._id,
          course: courseId,
        });

        if (existingCertificate) return null; // Skip if certificate already exists

        // Generate a secure Certificate ID
        const certificateId = `CERT-${Date.now()}-${student._id}-${Math.floor(Math.random() * 10000)}`;

        // Generate a hash for verification
        const hashCertificateId = crypto.createHash("sha256").update(certificateId).digest("hex");
        const verificationUrl = `https://makalla.com/verify/${hashCertificateId}`;

        // Prepare QR Code Data
        const qrCodeData = JSON.stringify({
          studentId: student._id,
          name: `${student.firstName} ${student.lastName}`,
          course: course.courseName,
          certificateHash: hashCertificateId, // Secure ID
          verificationUrl,
        });

        // Ensure unique and well-formatted PDF filename
        const sanitizedCourseName = course.courseName.replace(/\s+/g, "_");
        const pdfFilePath = path.join(__dirname, "../certificates", `${student._id}_${sanitizedCourseName}.pdf`);

        // Generate the certificate PDF
        await generateCertificatePDF(
          student._id,
          `${student.firstName} ${student.lastName}`,
          course.courseName,
          certificateId,
          qrCodeData
        );

        return new Certificate({
          student: student._id,
          course: courseId,
          certificateId,
          qrCode: verificationUrl,
          pdfPath: pdfFilePath,
        });
      })
    );

    // Remove null values (students who already had certificates)
    const validCertificates = certificates.filter((cert) => cert !== null);

    if (validCertificates.length > 0) {
      await Certificate.insertMany(validCertificates);
      course.courseStatus = "completed";
      await course.save();
    }

    res.status(200).json({
      message: "Certificates generated successfully!",
      certificates: validCertificates,
    });
  } catch (error) {
    console.error("Error generating certificates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const getCourseStatus = asyncHandler(async (req, res) => {
  try {
    const { courseId, section } = req.params;

    const sectionData = await Section.findOne({ course: courseId, section });
    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    res.status(200).json({ status: sectionData.status });
  } catch (error) {
    console.error("Error fetching course status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  getCourseStatus,
  markCourseAsCompleted,
  generateCertificates,
  updateAllAssessments,
  getCourseStudentsBySection,
  getInstructorCoursesAndStudents,
};
