const Course = require("../Model/Course.model");

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

    // Find courses where the instructor has section assignments
    const instructor = await User.findById(instructorId).populate({
      path: "sectionAssignments.course",
      select: "name",
    });

    if (!instructor || instructor.role !== "instructor") {
      return res.status(404).json({ message: "Instructor not found." });
    }

    const courses = instructor.sectionAssignments.map((assignment) => ({
      courseId: assignment.course._id,
      courseName: assignment.course.name,
      section: assignment.section,
    }));

    // Find students enrolled in the same course and section
    const students = await User.find({
      role: "student",
      "sectionAssignments": {
        $elemMatch: { course: { $in: courses.map(c => c.courseId) } },
      },
    }).select("firstName lastName sectionAssignments");

    const formattedCourses = courses.map((course) => ({
      id: course.courseId,
      name: course.courseName,
      section: course.section,
      students: students
        .filter(student =>
          student.sectionAssignments.some(
            assign => assign.course.equals(course.courseId) && assign.section === course.section
          )
        )
        .map(student => ({
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
        })),
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get students enrolled in a specific course
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course and populate studentsEnrolled and assessments
    const course = await Course.findById(courseId)
      .populate("studentsEnrolled");  // Populate students enrolled in the course

    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    res.status(200).json(course.studentsEnrolled);  // Return students enrolled in the course
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

// Create an assessment within a course
const createAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, exam, assignment, maxScore } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    // Create a new assessment and add it to the course's assessments array
    const assessment = {
      title,
      description,
      dueDate,
      exam,
      assignment,
      maxScore,
      studentSubmissions: [],
    };

    course.assessments.push(assessment);
    await course.save();

    res.status(201).json({ message: ERROR_MESSAGES.ASSESSMENT_CREATED, assessment });
  } catch (error) {
    console.error("Create Assessment Error:", error);
    res.status(500).json({ message: "Something went wrong" });
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
  getInstructorCourses,
  getCourseStudents,
  uploadCourseMaterial,
  createAssessment,
  gradeAssessment,
};
