const Course = require("../Model/Course.model");
const User = require("../Model/User.model");
const Section = require("../Model/Section.model");

const ERROR_MESSAGES = {
  COURSE_NOT_FOUND: "Course not found",
  STUDENTS_NOT_FOUND: "No students found for this course",
  MATERIAL_UPLOADED: "Course material uploaded successfully",
  ASSESSMENT_CREATED: "Assessment created successfully",
  ASSESSMENT_GRADED: "Assessment graded successfully",
};

// Get students by course and section
const getCourseStudentsBySection = async (req, res) => {
  try {
    const { courseId, selectedSection } = req.params;
    // Find section by courseId and section letter
    const sectionData = await Section.findOne({ course: courseId, section: selectedSection })
    .populate({
      path: "students",
      select: "name email studentId" // Only return specific fields for students
    })
    .populate({
      path: "course",
      select: "courseName instructorId exam assignment FinalResult" // Only return specific fields for the course
    });
  
console.log(sectionData);
    if (!sectionData) {
      return res.status(404).json({ message: "Section not found." });
    }

    if (!sectionData.students || sectionData.students.length === 0) {
      return res.status(404).json({ message: "No students found in this section." });
    }

    res.status(200).json(sectionData);
  } catch (error) {
    console.error("Error fetching students by course and section:", error);
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
const gradeAssessment = async (req, res) => {
  try {
    const { courseId, assessmentId } = req.params;
    const { studentId, score } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    // Find the specific assessment within the course
    const assessment = course.assessments.id(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Find the student submission for that assessment
    const studentSubmission = assessment.studentSubmissions.find(
      (submission) => submission.student.toString() === studentId
    );

    if (!studentSubmission) {
      return res.status(404).json({ message: "Student submission not found" });
    }

    studentSubmission.score = score;
    await course.save();

    res.status(200).json({ message: ERROR_MESSAGES.ASSESSMENT_GRADED, assessment });
  } catch (error) {
    console.error("Grade Assessment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  gradeAssessment,
  getCourseStudentsBySection,
  getInstructorCoursesAndStudents,
};
