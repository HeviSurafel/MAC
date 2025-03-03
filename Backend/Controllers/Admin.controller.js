const User = require("../Model/User.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const Section = require("../Model/Section.model");
const Assessment = require("../Model/Assessment.model");
const Feedback = require("../Model/Feedback.model");
const Contact = require("../Model/ContactUs.model");
const Payment = require("../Model/Payment.model");

const AdminController = {

  async createUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

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

      if (role === "student") {
        const payment = new Payment({
          student: user._id,
          course: null,
          amount: registrationFee || 0,
          type: "registration",
        });
        await payment.save({ session });
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
        if (!course) continue;

        if (role === "student") {
          existingSection.students.push(user._id);
          await existingSection.save({ session });

          if (!course.studentsEnrolled.includes(user._id)) {
            course.studentsEnrolled.push(user._id);
            await course.save({ session });
          }

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

          if (courses.fee && courses.paymentType) {
            const payment = new Payment({
              student: user._id,
              course: courseId,
            });
            await payment.save({ session });
          }
        } else if (role === "instructor") {
          if (!existingSection.instructors.includes(user._id)) {
            existingSection.instructors.push(user._id);
            await existingSection.save({ session });
          }

          if (!course.instructors.includes(user._id)) {
            await Course.findByIdAndUpdate(
              courseId,
              { $push: { instructors: user._id } },
              { new: true, session }
            );
          }
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating user:", error);
      res.status(500).json({ message: error.message });
    }
  },

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

      await Course.updateMany(
        { studentsEnrolled: user._id },
        { $pull: { studentsEnrolled: user._id } }
      );

      await Assessment.updateMany(
        { "studentResults.student": user._id },
        { $pull: { studentResults: { student: user._id } } }
      );

      await Section.updateMany(
        { students: user._id },
        { $pull: { students: user._id } }
      );

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

      await user.deleteOne();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async createCourse(req, res) {
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
        duration=3,
        paymentType,
        registrationFee,
      } = req.body;

      if (!courseName || !courseCode || !cost || !paymentType) {
        return res
          .status(400)
          .json({
            message: "Title, course code, cost, and payment type are required.",
          });
      }

      const costValue = Number(cost);
      const registrationFeeValue = Number(registrationFee);

      if (isNaN(costValue) || costValue < 0) {
        return res
          .status(400)
          .json({ message: "Cost must be a positive number." });
      }

      if (
        registrationFee &&
        (isNaN(registrationFeeValue) || registrationFeeValue < 0)
      ) {
        return res
          .status(400)
          .json({ message: "Registration fee must be a positive number." });
      }

      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date." });
      }

      if (!["monthly", "one-time"].includes(paymentType)) {
        return res
          .status(400)
          .json({
            message: "Invalid payment type. Allowed: 'monthly', 'one-time'.",
          });
      }

      if (paymentType === "monthly" && (!duration || duration <= 0)) {
        return res
          .status(400)
          .json({
            message:
              "Duration must be specified for monthly payments and be greater than 0.",
          });
      }

      const course = new Course({
        courseName,
        courseCode,
        description,
        subDescription,
        startDate,
        endDate,
        status,
        cost: costValue,
        paymentType,
        registrationFee: registrationFeeValue,
        durationInMonths: paymentType === "monthly" ? duration : null,
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
        const sectionDoc = await Section.findOne({
          course: new mongoose.Types.ObjectId(courseId),
          section: { $regex: `^${section.trim()}$`, $options: "i" },
        })
          .select("students")
          .lean();
  
        if (sectionDoc) {
          const studentIds = sectionDoc.students.map(
            (id) => new mongoose.Types.ObjectId(id)
          );
          studentFilter["_id"] = { $in: studentIds };
        }
      }
  
      const courses = await Course.find(query)
        .populate({
          path: "studentsEnrolled",
          match: studentFilter,
          select: "firstName lastName email",
          options: { lean: true },
        })
        .populate("instructors", "firstName lastName email")
        .lean();
  
      // Add section information to each student in the studentsEnrolled array
      const coursesWithAssessments = await Promise.all(
        courses.map(async (course) => {
          const studentsWithSection = await Promise.all(
            course.studentsEnrolled.map(async (student) => {
              // Find the section for this student
              const sectionDoc = await Section.findOne({
                course: course._id,
                students: student._id,
              }).select("section").lean();
  
              return {
                ...student,
                section: sectionDoc ? sectionDoc.section : "N/A", // Add section field
                assignmentScore:
                  studentAssessments[student._id.toString()]?.assignmentScore ?? 0,
                examScore: studentAssessments[student._id.toString()]?.examScore ?? 0,
                finalScore:
                  studentAssessments[student._id.toString()]?.finalScore ?? 0,
              };
            })
          );
  
          return {
            ...course,
            studentsEnrolled: studentsWithSection, // Replace with students including section
          };
        })
      );
  
      res.status(200).json(coursesWithAssessments);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  ,
  

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
      res.status(200).json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({
        message: "Failed to retrieve feedback. Please try again later.",
      });
    }
  },

  async getcontactUs(req, res) {
    try {
      const contactUs = await Contact.find();
      res.status(200).json(contactUs);
    } catch (error) {
      console.error("Error fetching contactUs:", error);
      res.status(500).json({
        message: "Failed to retrieve contactUs. Please try again later.",
      });
    }
  },

  async deleteContactUs(req, res) {
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

      await Assessment.deleteMany({ course: course._id });
      await Section.deleteMany({ course: course._id });
      await User.updateMany(
        { enrolledCourses: course._id },
        { $pull: { enrolledCourses: course._id } }
      );

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

      const hasPaidRegistration = await Payment.exists({
        student: studentId,
        course: courseId,
        registrationFee: { $gt: 0 },
      });

      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;

      const hasPaidCurrentMonth = await Payment.exists({
        student: studentId,
        course: courseId,
        monthsPaid: currentMonth,
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

  async getUnpaidStudents(req, res) {
    try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId)
        .populate("studentsEnrolled", "firstName lastName email")
        .select("courseName startDate cost durationInMonths");

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const startDate = new Date(course.startDate);
      const courseMonths = [];
      for (let i = 0; i < course.durationInMonths; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        courseMonths.push(monthDate.toLocaleString("default", { month: "short", year: "numeric" }));
      }

      const unpaidStudents = [];

      for (const student of course.studentsEnrolled) {
        const payments = await Payment.find({
          student: student._id,
          course: courseId,
        });

        const paidMonths = payments.flatMap((payment) => payment.monthsPaid);

        const unpaidMonths = courseMonths.filter(
          (month) => !paidMonths.includes(month)
        );

        unpaidStudents.push({
          student: {
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
          },
          courseId: course._id,
          courseName: course.courseName,
          paidMonths,
          unpaidMonths,
        });
      }

      res.json({ unpaidStudents });
    } catch (error) {
      console.error("Error fetching unpaid students:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async makePayment(req, res) {
    try {
      const { studentId, courseId } = req.params;
      const { amount, selectedMonths } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const epsilon = 0.01;
      const expectedAmount = course.cost * selectedMonths.length;
      if (amount < expectedAmount - epsilon) {
        return res.status(400).json({ message: "Insufficient amount" });
      }

      const payment = new Payment({
        student: studentId,
        course: courseId,
        amount,
        type: "monthly",
        monthsPaid: selectedMonths,
      });
      await payment.save();

      const payments = await Payment.find({
        student: studentId,
        course: courseId,
        type: "monthly",
      });

      const paidMonths = payments.flatMap((payment) => payment.monthsPaid);

      const startDate = new Date(course.startDate);
      const courseMonths = [];
      for (let i = 0; i < 3; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        courseMonths.push(monthDate.toLocaleString("default", { month: "short", year: "numeric" }));
      }

      const unpaidMonths = courseMonths.filter(
        (month) => !paidMonths.includes(month)
      );

      res.status(201).json({
        message: "Payment successful",
        paidMonths,
        unpaidMonths,
      });
    } catch (error) {
      console.error("Error making payment:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = AdminController;