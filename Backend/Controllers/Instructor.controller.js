const Course = require("../Model/Course.model");
const Section = require("../Model/Section.model");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const Assessment = require("../Model/Assessment.model");
const generateCertificatePDF = require("../config/generateCertificatePDF");
const Certificate = require("../Model/Certeficate.model");
const path = require("path");
const Batch = require("../Model/Batch.model");
const fs = require("fs");
const mongoose = require("mongoose");
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
    console.log(sectionData);
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
const getInstructorCourses = asyncHandler(async (req, res) => {
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
      })
      .populate("batch");
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
      batchId: section.batch._id,
      batchName: section.batch.name,
      batchStatus: section.batch.batchStatus,
      students: section.students.map((student) => ({
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      })),
    }));
    console.log("coursesWithStudents", sections);
    res.status(200).json(coursesWithStudents);
  } catch (error) {
    console.error("Error fetching instructor courses and students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getInstructorCoursesAndStudents = async (req, res) => {
  try {
    const { courseId, section, selectedBatch: batchId } = req.params;
    const instructorId = req.user._id;

    const courseStudents = response.data.students;

    const sections = await Section.find({ instructors: instructorId })
      .populate({
        path: "course",
        select: "courseName courseCode courseStatus",
      })
      .populate({
        path: "students",
        select: "firstName lastName email studentId",
      })
      .populate("batch");

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
      batchId: section.batch._id,
      batchName: section.batch.name,
      students: courseStudents.filter(
        (student) => student.section === section.section
      ),
    }));

    res.status(200).json(coursesWithStudents);
  } catch (error) {
    console.error("Error fetching instructor courses and students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseStudentsBySection = asyncHandler(async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { courseId, section, selectedBatch } = req.params;

    // Ensure that all parameters (courseId, section, batch) are provided
    if (
      !courseId ||
      !section ||
      !selectedBatch ||
      selectedBatch === "undefined" ||
      selectedBatch.trim() === ""
    ) {
      return res.status(400).json({
        message:
          "Course ID, section, and batch are required and batch cannot be 'undefined' or empty.",
      });
    }

    // Validate if selectedBatch is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(selectedBatch)) {
      return res.status(400).json({ message: "Invalid batch ID." });
    }

    // Find the section data
    const sectionData = await Section.findOne({
      course: courseId,
      section: section,
      batch: selectedBatch,
    }).populate({
      path: "students",
      select: "firstName lastName email studentId",
    });

    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    // Find assessments for the course and section
    const assessments = await Assessment.find({
      course: courseId,
      section: sectionData._id,
    }).populate({
      path: "studentResults.student",
      select: "firstName lastName email studentId",
    });

    if (!assessments.length) {
      return res
        .status(404)
        .json({ message: "No assessments found for this section." });
    }

    // Map students with their assessment results
    const studentsWithAssessment = sectionData.students.map((student) => {
      const studentAssessment = assessments.find((assessment) =>
        assessment.studentResults.some(
          (sr) => sr.student._id.toString() === student._id.toString()
        )
      );

      if (!studentAssessment) {
        return {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          studentId: student.studentId,
          assignmentScore: 0,
          examScore: 0,
          finalScore: 0,
        };
      }

      const studentResult = studentAssessment.studentResults.find(
        (sr) => sr.student._id.toString() === student._id.toString()
      );

      return {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentId: student.studentId,
        assignmentScore: studentResult?.assignmentScore || 0,
        examScore: studentResult?.examScore || 0,
        finalScore: studentResult?.finalScore || 0,
      };
    });

    res.status(200).json({
      course: courseId,
      section: section,
      batch: selectedBatch,
      students: studentsWithAssessment,
    });
  } catch (error) {
    console.error(
      "Error fetching students by course, section, and batch:",
      error
    );
    res.status(500).json({ message: "Internal server error", error });
  }
});

const updateAllAssessments = asyncHandler(async (req, res) => {
  try {
    const { courseId, section } = req.params; // Extract courseId and section from params
    const { assessments } = req.body; // Extract assessments from the request body

    // Validate request parameters
    if (!courseId || !section || !Array.isArray(assessments)) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    // Find the section based on courseId and section
    const sectionData = await Section.findOne({
      course: courseId,
      section,
    });

    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    // Find the assessment based on courseId and section
    let assessment = await Assessment.findOne({
      course: courseId,
      section: sectionData._id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    // Update studentResults in the assessment
    assessments.forEach((updatedStudent) => {
      const studentIndex = assessment.studentResults.findIndex(
        (studentAssessment) =>
          studentAssessment.student.toString() === updatedStudent.studentId
      );

      if (studentIndex !== -1) {
        // Log the student found and their current data

        // Update the student's scores if found
        assessment.studentResults[studentIndex].assignmentScore =
          Number(updatedStudent.assignmentScore) || 0;
        assessment.studentResults[studentIndex].examScore =
          Number(updatedStudent.examScore) || 0;
        assessment.studentResults[studentIndex].finalScore =
          Number(updatedStudent.finalScore) || 0;
      } else {
        console.log(
          `Student ${updatedStudent.studentId} not found in the assessment`
        );
      }
    });

    // Save the updated assessment
    await assessment.save();

    res.status(200).json({
      message: "Assessments updated successfully",
      assessment,
    });
  } catch (error) {
    console.error("Error updating assessments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const generateCertificates = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const { students } = req.body;

    // Validate inputs
    if (!courseId)
      return res.status(400).json({ message: "Course ID is required." });
    if (!students || students.length === 0)
      return res.status(400).json({ message: "No students provided." });

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    // Ensure the certificates directory exists
    const certificateDir = path.join(__dirname, "../certificates");
    if (!fs.existsSync(certificateDir)) {
      fs.mkdirSync(certificateDir, { recursive: true });
    }

    // Generate certificates for each student
    const certificates = await Promise.all(
      students.map(async (student) => {
        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
          student: student._id,
          course: courseId,
        });

        // If certificate exists, delete it and its associated PDF file
        if (existingCertificate) {
          // Delete the existing certificate PDF if it exists
          if (fs.existsSync(existingCertificate.pdfPath)) {
            fs.unlinkSync(existingCertificate.pdfPath);
            console.log(
              `Deleted old certificate PDF for student ${student._id}`
            );
          }

          // Delete the certificate from the database
          await Certificate.deleteOne({ _id: existingCertificate._id });
          console.log(
            `Deleted old certificate from database for student ${student._id}`
          );
        }

        // Generate a secure Certificate ID
        const certificateId = `CERT-${Date.now()}-${student._id}-${Math.floor(
          Math.random() * 10000
        )}`;

        // Generate a hash for verification
        const hashCertificateId = crypto
          .createHash("sha256")
          .update(certificateId)
          .digest("hex");
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
        const pdfFilePath = path.join(
          certificateDir,
          `${student._id}_${sanitizedCourseName}.pdf`
        );

        // Generate the certificate PDF
        try {
          await generateCertificatePDF(
            student._id,
            `${student.firstName} ${student.lastName}`,
            course.courseName,
            certificateId,
            qrCodeData
            // Pass the file path to the function
          );

          // Check if PDF was generated successfully
          if (fs.existsSync(pdfFilePath)) {
            console.log("PDF generated successfully:", pdfFilePath);
          } else {
            console.error("PDF not generated:", pdfFilePath);
          }
        } catch (error) {
          console.error(
            `Error generating PDF for student ${student._id}:`,
            error
          );
          return null; // Skip this student if PDF generation fails
        }

        // Create a new certificate document
        const newCertificate = new Certificate({
          student: student._id,
          course: courseId,
          certificateId,
          qrCode: verificationUrl,
          pdfPath: pdfFilePath,
        });

        return newCertificate;
      })
    );

    // Remove null values (students who already had certificates or failed PDF generation)
    const validCertificates = certificates.filter((cert) => cert !== null);

    // Save valid certificates to the database
    if (validCertificates.length > 0) {
      try {
        await Certificate.insertMany(validCertificates);

        // Update the course status to "completed"
        course.courseStatus = "completed";
        await course.save();
      } catch (error) {
        console.error("Error saving certificates:", error);
        return res
          .status(500)
          .json({ message: "Failed to save certificates." });
      }
    }

    // Respond with success message and generated certificates
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
  getInstructorCourses,
};
