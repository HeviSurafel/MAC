const User = require("../Model/User.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const Section = require("../Model/Section.model"); // Import the Section model
const Assessment = require("../Model/Assessment.model");
const Feedback = require("../Model/Feedback.model");
const Contact = require("../Model/ContactUs.model");
const Payment = require("../Model/Payment.model");
const AdminController = {
  async createUser(req, res) {
    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction(); // Start a transaction
  
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        status = "active",
        dateOfBirth,
        address,
        phoneNumber,
        department,
        courses = [],
        section = "",
        registrationFee,
      } = req.body;
  
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Email already exists." });
      }
  
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        status,
        dateOfBirth,
        address,
        phoneNumber,
        department,
        registrationFee,
      });
  
      await user.save({ session });
  
      // ✅ Handle Registration Fee Payment
      if (registrationFee > 0) {
        const regPayment = new Payment({
          student: user._id,
          course: null,
          amount: registrationFee,
          type: "registration",
        });
        await regPayment.save({ session });
      }
  
      for (let i = 0; i < courses.length; i++) {
        const courseId = courses[i];
        const sectionName = section.split(",")[i] || "A";
  
        let existingSection = await Section.findOne({
          course: courseId,
          section: sectionName,
        }).session(session);
  
        if (!existingSection) {
          existingSection = new Section({
            course: courseId,
            section: sectionName,
            students: [],
            instructors: [],
          });
          await existingSection.save({ session });
        }
  
        const course = await Course.findById(courseId).session(session);
        if (!course) continue; // Skip if course doesn't exist
  
        if (role === "student") {
          // ✅ Add student to section
          existingSection.students.push(user._id);
          await existingSection.save({ session });
  
          // ✅ Add student to the course
          if (!course.studentsEnrolled.includes(user._id)) {
            course.studentsEnrolled.push(user._id);
            await course.save({ session });
          }
  
          // ✅ Handle assessments
          let existingAssessment = await Assessment.findOne({
            course: courseId,
            section: existingSection._id,
          }).session(session);
  
          if (!existingAssessment) {
            existingAssessment = new Assessment({
              course: courseId,
              section: existingSection._id,
              examWeight: 0,
              assignmentWeight: 0,
              finalWeight: 0,
              studentResults: [],
            });
          }
  
          // ✅ Add student to assessment if not already added
          const studentExists = existingAssessment.studentResults.some(
            (result) => result.student.equals(user._id)
          );
          if (!studentExists) {
            existingAssessment.studentResults.push({
              student: user._id,
              assignmentScore: 0,
              examScore: 0,
              finalScore: 0,
            });
          }
  
          await existingAssessment.save({ session });
  
          // ✅ Add Course Payment Entry
          if (courses.fee && courses.paymentType) {
            const payment = new Payment({
              student: user._id,
              course: courseId,
            });
            await payment.save({ session });
          }
        } else if (role === "instructor") {
          // ✅ Add instructor to section
          if (!existingSection.instructors.includes(user._id)) {
            existingSection.instructors.push(user._id);
            await existingSection.save({ session });
          }
  
          // ✅ Add instructor to course
          if (!course.instructors.includes(user._id)) {
            await Course.findByIdAndUpdate(
              courseId,
              { $push: { instructors: user._id } },
              { new: true, session }
            );
          }
        }
      }
  
      await session.commitTransaction(); // Commit transaction if everything is successful
      session.endSession();
  
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      await session.abortTransaction(); // Rollback changes in case of error
      session.endSession();
      console.error("Error creating user:", error);
      res.status(500).json({ message: error.message });
    }
  }
  
,

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Remove user from enrolled courses
      await Course.updateMany(
        { studentsEnrolled: user._id },
        { $pull: { studentsEnrolled: user._id } }
      );

      // Remove user from assessments
      await Assessment.updateMany(
        { "studentResults.student": user._id },
        { $pull: { studentResults: { student: user._id } } }
      );

      // Remove user from sections
      await Section.updateMany(
        { students: user._id },
        { $pull: { students: user._id } }
      );

      // Remove user from instructor roles if applicable
      if (user.role === "instructor") {
        await Course.updateMany(
          { instructors: user._id },
          { $pull: { instructors: user._id } }
        );
        await Section.updateMany(
          { instructors: user._id },
          { $pull: { instructors: user._id } }
        );
      }

      // Delete the user
      await user.deleteOne();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async createCourse(req, res) {
    console.log(req.body);
    try {
      const {
        courseName,
        courseCode,
        description,
        subDescription,
        startDate,
        endDate,
        status,
        cost,
        duration, // ✅ Use 'duration' consistently
        paymentType,
        registrationFee,
      } = req.body;

      // ✅ Validate required fields
      if (!courseName || !courseCode || !cost || !paymentType) {
        return res
          .status(400)
          .json({
            message: "Title, course code, cost, and payment type are required.",
          });
      }

      // ✅ Convert cost & registrationFee to numbers
      const costValue = Number(cost);
      const registrationFeeValue = Number(registrationFee);

      // ✅ Validate cost (should be positive)
      if (isNaN(costValue) || costValue < 0) {
        return res
          .status(400)
          .json({ message: "Cost must be a positive number." });
      }

      // ✅ Validate registration fee (should be positive)
      if (
        registrationFee &&
        (isNaN(registrationFeeValue) || registrationFeeValue < 0)
      ) {
        return res
          .status(400)
          .json({ message: "Registration fee must be a positive number." });
      }

      // ✅ Validate dates
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date." });
      }

      // ✅ Validate payment type
      if (!["monthly", "one-time"].includes(paymentType)) {
        return res
          .status(400)
          .json({
            message: "Invalid payment type. Allowed: 'monthly', 'one-time'.",
          });
      }

      // ✅ Validate duration for monthly courses
      if (paymentType === "monthly" && (!duration || duration <= 0)) {
        return res
          .status(400)
          .json({
            message:
              "Duration must be specified for monthly payments and be greater than 0.",
          });
      }

      // ✅ Create the course
      const course = new Course({
        courseName,
        courseCode,
        description,
        subDescription,
        startDate,
        endDate,
        status,
        cost: costValue, // Store as a number
        paymentType,
        registrationFee: registrationFeeValue, // Store as a number
        durationInMonths: paymentType === "monthly" ? duration : null, // ✅ Only store if monthly
        studentsEnrolled: [],
      });

      await course.save();
      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async getAllCourses(req, res) {
    try {
      const { courseId, section } = req.query;

      let query = {};
      if (courseId) {
        if (!mongoose.isValidObjectId(courseId)) {
          return res.status(400).json({ message: "Invalid courseId format" });
        }
        query._id = new mongoose.Types.ObjectId(courseId);
      }

      let studentFilter = {};
      let studentAssessments = {};

      if (section && courseId) {
        console.log(
          "Searching for section:",
          section,
          "in courseId:",
          courseId
        );

        // Ensure section name is trimmed and case-insensitive
        const sectionDoc = await Section.findOne({
          course: new mongoose.Types.ObjectId(courseId),
          section: { $regex: `^${section.trim()}$`, $options: "i" },
        })
          .select("students")
          .lean();

        if (!sectionDoc) {
          console.log(
            "No section found for courseId:",
            courseId,
            "and section:",
            section
          );
          return res
            .status(404)
            .json({ message: "No section found for this course!" });
        }

        console.log("Section found:", sectionDoc);

        const studentIds = sectionDoc.students.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        studentFilter["_id"] = { $in: studentIds };

        // Fetch assessment results in one query
        const assessment = await Assessment.findOne({
          course: new mongoose.Types.ObjectId(courseId),
          section: sectionDoc._id,
        })
          .select("studentResults")
          .lean();

        if (assessment) {
          assessment.studentResults.forEach((result) => {
            studentAssessments[result.student.toString()] = {
              assignmentScore: result.assignmentScore ?? 0,
              examScore: result.examScore ?? 0,
              finalScore: result.finalScore ?? 0,
            };
          });
        }
      }

      // Fetch courses with filtered students and instructors
      const courses = await Course.find(query)
        .populate({
          path: "studentsEnrolled",
          match: studentFilter,
          select: "firstName lastName email",
          options: { lean: true }, // Return plain objects instead of Mongoose documents
        })
        .populate("instructors", "firstName lastName email")
        .lean(); // Make sure all documents are plain objects

      // Attach assessment scores to students
      const coursesWithAssessments = courses.map((course) => ({
        ...course,
        studentsEnrolled: course.studentsEnrolled.map((student) => ({
          ...student,
          assignmentScore:
            studentAssessments[student._id.toString()]?.assignmentScore ?? 0,
          examScore: studentAssessments[student._id.toString()]?.examScore ?? 0,
          finalScore:
            studentAssessments[student._id.toString()]?.finalScore ?? 0,
        })),
      }));

      res.status(200).json(coursesWithAssessments);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id).populate(
        "studentsEnrolled"
      );
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async updateCourse(req, res) {
    try {
      const {
        startDate,
        endDate,
        cost,
        durationInMonths,
        registrationFee,
        instructors,
      } = req.body;
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date." });
      }
      if (cost && cost < 0) {
        return res
          .status(400)
          .json({ message: "Cost must be a positive value." });
      }
      if (registrationFee && registrationFee < 0) {
        return res
          .status(400)
          .json({ message: "Registration fee must be a positive value." });
      }

      if (durationInMonths && durationInMonths <= 0) {
        return res
          .status(400)
          .json({ message: "Duration must be greater than 0." });
      }
      if (
        instructors &&
        (!Array.isArray(instructors) ||
          instructors.some((id) => !mongoose.Types.ObjectId.isValid(id)))
      ) {
        return res.status(400).json({ message: "Invalid instructor IDs." });
      }
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          instructors: instructors || [],
        },
        { new: true }
      );

      if (!updatedCourse)
        return res.status(404).json({ message: "Course not found" });

      res
        .status(200)
        .json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
      console.error("Update Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async getFeedback(req, res) {
    try {
      const feedback = await Feedback.find();
      res.status(200).json(feedback); // ✅ Use 200 for GET responses
    } catch (error) {
      console.error("Error fetching feedback:", error); // ✅ Log error for debugging
      res.status(500).json({
        message: "Failed to retrieve feedback. Please try again later.",
      }); // ✅ Generic error message
    }
  },
  async getcontactUs(req, res) {
    try {
      const contactUs = await Contact.find();
      res.status(200).json(contactUs); // ✅ Use 200 for GET responses
    } catch (error) {
      console.error("Error fetching contactUs:", error); // ✅ Log error for debugging
      res.status(500).json({
        message: "Failed to retrieve contactUs. Please try again later.",
      }); // ✅ Generic error message
    }
  },
  async deleteContactUs(req, res) {
    console.log(req.params);
    try {
      const contactUs = await Contact.findByIdAndDelete(req.params.id);
      if (!contactUs)
        return res.status(404).json({ message: "ContactUs not found" });
      res.status(200).json({ message: "ContactUs deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async deleteFeedback(req, res) {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);
      if (!feedback)
        return res.status(404).json({ message: "Feedback not found" });
      res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  async deleteCourse(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // Delete related assessments
      await Assessment.deleteMany({ course: course._id });

      // Delete related sections
      await Section.deleteMany({ course: course._id });

      // Remove course from enrolled students
      await User.updateMany(
        { enrolledCourses: course._id },
        { $pull: { enrolledCourses: course._id } }
      );

      // Delete the course itself
      await course.deleteOne();

      res
        .status(200)
        .json({ message: "Course and related data deleted successfully" });
    } catch (error) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async getInstructors(req, res) {
    try {
      const instructors = await User.find({ role: "instructor" });
      res.status(200).json(instructors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async checkPaymentStatus(req, res) {
    try {
      const { studentId, courseId } = req.params;

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // Check registration fee payment
      const hasPaidRegistration = await Payment.exists({
        student: studentId,
        course: courseId,
        registrationFee: { $gt: 0 }, // ✅ Check if registration fee exists
      });

      // Get current month & year
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;

      // Check monthly payment
      const hasPaidCurrentMonth = await Payment.exists({
        student: studentId,
        course: courseId,
        monthsPaid: currentMonth, // ✅ Check if the student has paid for this month
      });

      res.json({
        hasPaidRegistration: !!hasPaidRegistration,
        hasPaidCurrentMonth: !!hasPaidCurrentMonth,
        registrationFee: course.registrationFee,
        monthlyFee: course.cost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ Get unpaid students with course & section info
  async getUnpaidStudents(req, res) {
    try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId)
        .populate("studentsEnrolled", "firstName lastName email") // Get student details
        .select("courseName registrationFee cost startDate"); // Select necessary fields

      if (!course) return res.status(404).json({ message: "Course not found" });

      // Fetch sections & their students
      const sections = await Section.find({ course: courseId })
        .populate("students", "firstName lastName email")
        .select("section students");

      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;
      const unpaidStudents = [];

      for (let student of course.studentsEnrolled) {
        // Find student's section
        const studentSection = sections.find((sec) =>
          sec.students.some((s) => s._id.equals(student._id))
        );

        // Check registration payment
        const hasPaidRegistration = await Payment.exists({
          student: student._id,
          course: courseId,
          registrationFee: { $gt: 0 },
        });

        if (!hasPaidRegistration) {
          unpaidStudents.push({
            student,
            reason: "Unpaid registration fee",
            courseName: course.courseName,
            startDate: course.startDate,
            courseId: course._id,
            section: studentSection ? studentSection.section : "N/A",
          });
          continue;
        }

        // Check monthly payment
        const hasPaidCurrentMonth = await Payment.exists({
          student: student._id,
          course: courseId,
          monthsPaid: currentMonth,
        });

        if (!hasPaidCurrentMonth) {
          unpaidStudents.push({
            student,
            reason: "Unpaid monthly fee",
            courseName: course.courseName,
            startDate: course.startDate,
            section: studentSection ? studentSection.section : "N/A",
          });
        }
      }

      res.json({ unpaidStudents });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ Handle payments (registration & monthly)
  async makePayment(req, res) {
    console.log(req.body);
    try {
      const { amount, paymentType, selectedMonths } = req.body;
      const { studentId, courseId } = req.params;

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      let updateFields = { amount, registrationFee: 0, Monthlypayment: 0 };

      if (paymentType === "registration") {
        if (amount !== course.registrationFee) {
          return res
            .status(400)
            .json({ message: "Incorrect registration fee" });
        }
        updateFields.registrationFee = amount;
      }

      if (paymentType === "monthly") {
        if (amount !== course.cost * selectedMonths.length) {
          return res
            .status(400)
            .json({ message: "Incorrect monthly fee total" });
        }
        updateFields.Monthlypayment = amount;
        updateFields.$addToSet = { monthsPaid: { $each: selectedMonths } };
      }

      // Find or create payment record
      let payment = await Payment.findOne({
        student: studentId,
        course: courseId,
      });

      if (payment) {
        await Payment.updateOne({ _id: payment._id }, { $set: updateFields });
      } else {
        payment = new Payment({
          student: studentId,
          course: courseId,
          ...updateFields,
        });
        await payment.save();
      }

      res.status(201).json({ message: "Payment successful", payment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = AdminController;
