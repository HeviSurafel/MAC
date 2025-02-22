const Course = require("../Model/Course.model");
const Section = require("../Model/Section.model");
const Assessment = require("../Model/Assessment.model");

const getCourseStudentsBySection = async (req, res) => {
  try {
    const { courseId, selectedSection } = req.params;

    // Find the section
    const sectionData = await Section.findOne({ course: courseId, section: selectedSection })
      .populate({
        path: "students",
        select: "firstName lastName email studentId",
      });

    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    if (!sectionData.students || sectionData.students.length === 0) {
      return res.status(404).json({ message: "No students found in this section." });
    }

    // Find the assessment for this course and section
    const assessment = await Assessment.findOne({ course: courseId, section: sectionData._id });

    if (!assessment) {
      return res.status(404).json({ message: "No assessment found for this section." });
    }

    // Map students and merge assessment results
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
        examWeight: assessment.examWeight,
        assignmentWeight: assessment.assignmentWeight,
        finalWeight: assessment.finalWeight,
      };
    });

    res.status(200).json(studentsWithAssessment);
  } catch (error) {
    console.error("Error fetching students with assessment data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get instructor's courses and students
const getInstructorCoursesAndStudents = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Find all sections where the instructor is assigned
    const sections = await Section.find({ instructors: instructorId })
      .populate({
        path: "course",
        select: "courseName courseCode",
      })
      .populate({
        path: "students",
        select: "firstName lastName email",
      });

    if (!sections || sections.length === 0) {
      return res.status(404).json({ message: "No sections found for this instructor." });
    }

    // Format response
    const coursesWithStudents = sections.map((section) => ({
      courseId: section.course._id,
      courseName: section.course.courseName,
      section: section.section,
      students: section.students.map(student => ({
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
};

// Grade an assessment for a specific student

const updateAssessment = async (req, res) => {
  try {
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);

    const { studentId, assignmentWeight, examWeight, finalWeight } = req.body;
    const { courseId, section } = req.params;

    if (!courseId || !section) {
      return res.status(400).json({ message: "Missing courseId or section in the request." });
    }

    const sectionData = await Section.findOne({ course: courseId, section });
    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    let assessment = await Assessment.findOne({ course: courseId, section: sectionData._id });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found." });
    }

    let studentAssessment = assessment.studentResults.find(
      (sr) => sr.student.toString() === studentId
    );

    if (!studentAssessment) {
      return res.status(404).json({ message: "Student assessment not found." });
    }

    studentAssessment.assignmentWeight = assignmentWeight;
    studentAssessment.examWeight = examWeight;
    studentAssessment.finalWeight = finalWeight;

    await assessment.save();
    res.status(200).json({ message: "Assessment updated successfully", assessment });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  updateAssessment,
  getCourseStudentsBySection,
  getInstructorCoursesAndStudents,
};
