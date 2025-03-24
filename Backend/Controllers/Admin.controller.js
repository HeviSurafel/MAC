const User = require("../Model/User.model");
const Course = require("../Model/Course.model");
const mongoose = require("mongoose");
const generateCertificatePDF = require("../config/generateCertificatePDF");
const Section = require("../Model/Section.model");
const Assessment = require("../Model/Assessment.model");
const Feedback = require("../Model/Feedback.model");
const Contact = require("../Model/ContactUs.model");
const Payment = require("../Model/Payment.model");
const Certificate = require("../Model/Certeficate.model");
const fs = require("fs").promises;
const files=require("fs");
const crypto = require('crypto');
const path = require("path");
const asyncHandler = require("express-async-handler");
const Blog = require("../Model/Blog.model");
const Like = require("../Model/Like.model");
const Comment = require("../Model/Comment.model");
const cloudinary = require("../Middleware/cloudinary");
const Batch = require("../Model/Batch.model");
const { strict } = require("assert");
const AdminController = {
  getDashboard: asyncHandler(async (req, res) => { 
    try {
      const totalUsers = await User.countDocuments();
      const totalStudents = await User.countDocuments({ role: "student" });
      const totalInstructors = await User.countDocuments({ role: "instructor" });
      const totalAdmins = await User.countDocuments({ role: "admin" });

      const totalCourses = await Course.countDocuments();
      const totalPayments = await Payment.countDocuments();
      
      // 🔄 Calculate Total Revenue (Including Registration Fees)
      const paymentRevenue = await Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmountPaid" } } },
      ]);

      const registrationRevenue = await User.aggregate([
        { 
          $match: { registrationFee: { $exists: true, $gt: 0 } } // Ensure registrationFee exists
        },
        { 
          $group: { _id: null, total: { $sum: "$registrationFee" } } } 
      ]);

      const totalRevenue = (paymentRevenue.length ? paymentRevenue[0].total : 0) +
                           (registrationRevenue.length ? registrationRevenue[0].total : 0);

      const activeUsers = await User.countDocuments({ status: "active" });
      const suspendedUsers = await User.countDocuments({ status: "suspended" });

      // 📌 Monthly User Registration Trend (Last 6 Months)
      const userGrowth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
      ]);

      // 📌 Monthly Revenue Trend (Last 6 Months)
      const revenueTrend = await Payment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
      ]);

      res.json({
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalPayments,
        totalRevenue,
        activeUsers,
        suspendedUsers,
        userGrowth,
        revenueTrend,
      });
    } catch (error) {
      console.error("Analytics Fetch Error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  }),

   createUser : asyncHandler(async (req, res) => {
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
        discountType,
        monthlyCost,
        registrationFee,
        batch,
      } = req.body;
  
      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Email already exists." });
      }
      // ✅ Check if the batch is completed before allowing enrollment
      if (batch) {
        const batchData = await Batch.findById(batch).session(session);
        
        if (batchData && batchData.batchStatus === "completed") {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: "Batch is completed. No more students can be enrolled." });
        }
      }
  
      // Create the user
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
        batch: batch || null,
      });
  
      await user.save({ session });
  
      // ✅ Handle student enrollment (Ensuring batch isn't completed)
      if (role === "student") {
        for (let i = 0; i < courses.length; i++) {
          const enrolledCourse = await Course.findById(courses[i])
            .populate("batches")
            .session(session);
            console.log("enrolledCourse",enrolledCourse)
          if (enrolledCourse) {
            if (enrolledCourse.batches.every((b) => b.batchStatus === "completed")) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({
                message: "Course batch is completed. No more students can be enrolled.",
              });
            }
  
            // ✅ Create a payment record for the student
            const payment = new Payment({
              student: user._id,
              course: enrolledCourse._id,
              amount: monthlyCost,
              discountType,
              batch,
            });
            await payment.save({ session });
  
            // ✅ Add student to the section
            const sectionName = section.split(",")[i] || "A"; // Default to "A" if not provided
            let existingSection = await Section.findOne({
              course: enrolledCourse._id,
              section: sectionName,
            }).session(session);
  
            if (!existingSection) {
              existingSection = new Section({
                course: enrolledCourse._id,
                section: sectionName,
                students: [user._id],
                instructors: [],
                batch: batch || null,
              });
            } else {
              if (!existingSection.students.includes(user._id)) {
                existingSection.students.push(user._id);
              }
            }
            await existingSection.save({ session });
  
            // ✅ Add student to the course's studentsEnrolled array
            if (!enrolledCourse.studentsEnrolled.includes(user._id)) {
              enrolledCourse.studentsEnrolled.push(user._id);
              await enrolledCourse.save({ session });
            }
  
            // ✅ Ensure a single assessment per course + section
            let assessment = await Assessment.findOne({
              course: enrolledCourse._id,
              section: existingSection._id,
            }).session(session);
  
            if (!assessment) {
              assessment = new Assessment({
                studentResults: [
                  {
                    student: user._id,
                    assignmentScore: 0,
                    examScore: 0,
                    finalScore: 0,
                  },
                ],
                course: enrolledCourse._id,
                section: existingSection._id,
              });
            } else {
              // Check if student already exists in studentResults
              const studentExists = assessment.studentResults.some(
                (record) => record.student.toString() === user._id.toString()
              );
  
              if (!studentExists) {
                assessment.studentResults.push({
                  student: user._id,
                  assignmentScore: 0,
                  examScore: 0,
                  finalScore: 0,
                });
              }
            }
  
            await assessment.save({ session });
          }
        }
      }
  
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        message: `User created and added to sections successfully.`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        message: `Error creating user: ${error.message}`,
      });
    }
  }),
  



  createCourse : asyncHandler(async (req, res) => { 
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const {
        courseName,
        courseCode,
        description,
        subDescription,
        startDate,
        endDate,
        instructors = [],
        cost,
        duration = 3,
        paymentType,
        batchStatus = "incomplete", // Default batch status
        registrationFee,
      } = req.body;
  
      // Validate required fields for course
      if (!courseName || !courseCode || !cost || !paymentType) {
        return res.status(400).json({
          message: "Course name, course code, cost, and payment type are required.",
        });
      }
  
      const costValue = Number(cost);
      const registrationFeeValue = Number(registrationFee);
  
      // Validate cost and registration fee
      if (isNaN(costValue) || costValue < 0) {
        return res.status(400).json({ message: "Cost must be a positive number." });
      }
  
      if (registrationFee && (isNaN(registrationFeeValue) || registrationFeeValue < 0)) {
        return res.status(400).json({ message: "Registration fee must be a positive number." });
      }
  
      // Validate start and end dates
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: "End date must be after start date." });
      }
  
      // Validate payment type
      if (!["monthly", "one-time"].includes(paymentType)) {
        return res.status(400).json({
          message: "Invalid payment type. Allowed: 'monthly', 'one-time'.",
        });
      }
  
      // Validate duration for monthly payments
      if ((!duration || duration <= 0) && paymentType === "monthly") {
        return res.status(400).json({
          message: "Duration must be specified for monthly payments and be greater than 0.",
        });
      }
  
      // Check if the course already exists with the same courseCode
      let course = await Course.findOne({ courseCode }).session(session);
  
      if (!course) {
        // If course doesn't exist, create a new course
        course = new Course({
          courseName,
          courseCode,
          description,
          subDescription,
          startDate,
          endDate,
          cost: costValue,
          paymentType,
          registrationFee: registrationFeeValue,
          durationInMonths: duration,
          studentsEnrolled: [],
          instructors,
          batches: [],
        });
        await course.save({ session });
      }
  
      // Generate a unique batch name for the course
      const batchCount = await Batch.countDocuments({ course: course._id }).session(session);
      const batchName = `${course.courseName} Batch ${String(batchCount + 1).padStart(2, "0")}`;
  
      // Create the batch with default batchStatus as "incomplete"
      const batch = new Batch({
        name: batchName,
        course: course._id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        students: [],
        batchStatus: "incomplete", // Explicitly setting batch status
      });
  
      await batch.save({ session });
  
      // Associate the batch with the course
      course.batches.push(batch._id);
      await course.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
  
      res.status(201).json({ message: "Batch added successfully", course, batch });
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      res.status(500).json({ message: "An error occurred while creating the course.", error: error.message });
      console.error("Error in createCourse:", error);
    } finally {
      // End the session
      session.endSession();
    }
  }),



   getFilteredByCourseSectionAndBatch : asyncHandler(async (req, res) => {
    try {
     
      const { courseId, section, batch } = req.params;

        // Ensure courseId is valid ObjectId
        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid course _id format" });
        }

        // Base query to find the course by ID
        let query = { _id: new mongoose.Types.ObjectId(courseId) };

        // Fetch the course based on the query object
        const course = await Course.findOne(query)
            .populate({
                path: "studentsEnrolled",
                select: "firstName lastName email section batch", // Include section and batch for each student
                options: { lean: true },
            })
            .populate("instructors", "firstName lastName email")
            .populate({
                path: "batches",
                select: "name _id", // Select the fields you need from the Batch model
            })
            .lean();
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Find the section data
        const sectionData = await Section.findOne({
            course: courseId,
            section: section,
            batch: batch, // Changed selectedBatch to batch
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
            return res.status(404).json({ message: "No assessments found for this section." });
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

        // Return the course object with student results in the desired structure
        res.status(200).json([
            {
                _id: course._id,
                courseName: course.courseName,
                courseCode: course.courseCode,
                description: course.description,
                courseStatus: course.courseStatus,
                instructors: course.instructors, // Instructors array
                studentsEnrolled: studentsWithAssessment, // Replaced with mapped students
                durationInMonths: course.durationInMonths,
                cost: course.cost,
                registrationFee: course.registrationFee,
                batches: course.batches, // Batches array
                startDate: course.startDate,
                endDate: course.endDate,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
            },
        ]);
    } catch (error) {
        console.error("Error in getFilteredByCourseSectionAndBatch:", error);
        res.status(500).json({ message: error.message });
    }
}),

  

  getAllCourses: asyncHandler(async (req, res) => {
    try {
      const { courseId, section, batch } = req.query;

      let query = {};
  
      // Validate and build query for courseId
      if (courseId) {
        if (!mongoose.isValidObjectId(courseId)) {
          return res.status(400).json({ message: "Invalid courseId format" });
        }
        query._id = new mongoose.Types.ObjectId(courseId);
      }
  
      let studentFilter = {};
  
      // If section and courseId are provided, filter students by section
      if (section && courseId) {
        const sectionDoc = await Section.findOne({
          course: new mongoose.Types.ObjectId(courseId),
          section: { $regex: `^${section.trim()}$`, $options: "i" },
        })
          .select("students")
          .lean();
  
        if (sectionDoc) {
          const studentIds = sectionDoc.students.map((id) => new mongoose.Types.ObjectId(id));
          studentFilter["_id"] = { $in: studentIds };
        }
      }
  
      // If batch is provided, add batch filter to query
      if (batch) {
        query.batches = { $in: [new mongoose.Types.ObjectId(batch)] };
      }
  
      // Fetch courses with enrolled students and batches
      const courses = await Course.find(query)
        .populate({
          path: "studentsEnrolled",
          match: studentFilter,
          select: "firstName lastName email", // Limit to only necessary fields
          options: { lean: true },
        })
        .populate("instructors", "firstName lastName email")
        .populate({
          path: "batches",
        })
        .lean();
  
 
      // Fetch assessments for the requested courses and sections (only if courseId is provided)
      const assessments =
        courseId && mongoose.isValidObjectId(courseId)
          ? await Assessment.find({ course: courseId }).lean()
          : [];
  
      // Create a lookup map for assessments to speed up student assessment lookups
      const assessmentMap = assessments.reduce((map, assessment) => {
        assessment.studentResults.forEach((result) => {
          map[result.student.toString()] = result;
        });
        return map;
      }, {});
  
      // Process each course
      const coursesWithAssessments = await Promise.all(
        courses.map(async (course) => {
          // Get students with their section and assessment data
          const studentsWithAssessments = await Promise.all(
            course.studentsEnrolled.map(async (student) => {
              // Find the section for this student
              const sectionDoc = await Section.findOne({
                course: course._id,
                students: student._id,
              })
                .select("section")
                .lean();
  
              // Fetch the student's assessment from the assessmentMap
              const studentAssessment = assessmentMap[student._id.toString()] || {};
  
              return {
                ...student,
                section: sectionDoc ? sectionDoc.section : "N/A",
                assignmentScore: studentAssessment?.assignmentScore ?? 0,
                examScore: studentAssessment?.examScore ?? 0,
                finalScore: studentAssessment?.finalScore ?? 0,
              };
            })
          );

          // Include batch names in the course response
          return {
            ...course,
            cost: course.cost.toFixed(2),
            studentsEnrolled: studentsWithAssessments,
          };
        })
      );
  
      res.status(200).json(coursesWithAssessments);
    } catch (error) {
      console.error("Error fetching courses with assessments:", error);
      res.status(500).json({ message: "Something went wrong while fetching courses." });
    }
  }),
  
  

getAllUsers: asyncHandler(async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users without filters or sorting
    res.status(200).json( users );
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong while fetching users." });
  }
}),
  // Get user by ID
   getUserById : asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Initialize an empty courses array
      let courses = [];
  
      if (user.role === "student") {
        // Fetch the courses the student is enrolled in
        courses = await Course.find({ studentsEnrolled: user._id }).populate('studentsEnrolled'); // Populate studentsEnrolled field
      } else if (user.role === "instructor") {
        // Fetch the courses the instructor is teaching
        courses = await Course.find({ instructors: user._id }).populate('instructors');
      }
  
      res.status(200).json({
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        courses: courses, // Return the courses
      });
    } catch (error) {
      console.error("Error fetching user or courses:", error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }),
  
  

  // Update user
  updateUser: asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  }),
  suspendUser: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.status = "suspended";
      await user.save();
      res.status(200).json({ message: "User suspended successfully" });
    } catch (error) {
     console.error("Error suspending user:", error);
     res.status(500).json({ message: "Something went wrong",error:error.message }); 
    }
}),
UnsuspendUser: asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.status = "active";
    await user.save();
    res.status(200).json({ message: "User suspended successfully" });
  } catch (error) {
   console.error("Error suspending user:", error);
   res.status(500).json({ message: "Something went wrong",error:error.message }); 
  }
}),

  // Delete user
  deleteUser: asyncHandler(async (req, res) => {
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

    await Payment.deleteMany({ student: user._id });
    await Certificate.deleteMany({ student: user._id });
    await User.deleteOne({ _id: user._id });

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

    res.status(200).json({ message: "User deleted successfully" });
  }),






























  getCourseById: asyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate(
        "studentsEnrolled"
      );
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }),

  updateCourse: asyncHandler(async (req, res) => {
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
  }),

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

  getcontactUs: asyncHandler(async (req, res) => {
    try {
      const contactUs = await Contact.find();
      res.status(200).json(contactUs);
    } catch (error) {
      console.error("Error fetching contactUs:", error);
      res.status(500).json({
        message: "Failed to retrieve contactUs. Please try again later.",
      });
    }
  }),

  deleteContactUs: asyncHandler(async (req, res) => {
    try {
      const contactUs = await Contact.findByIdAndDelete(req.params.id);
      if (!contactUs)
        return res.status(404).json({ message: "ContactUs not found" });
      res.status(200).json({ message: "ContactUs deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }),

  deleteFeedback: asyncHandler(async (req, res) => {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);
      if (!feedback)
        return res.status(404).json({ message: "Feedback not found" });
      res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }),

  deleteCourse: asyncHandler(async (req, res) => {
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
  }),

  getInstructors: asyncHandler(async (req, res) => {
    try {
      const instructors = await User.find({ role: "instructor" });
      res.status(200).json(instructors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),

  checkPaymentStatus: asyncHandler(async (req, res) => {
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
  }),
   getUnpaidStudents : asyncHandler(async (req, res) => {
    try {
      const { courseId, selectedBatch } = req.params;
  
      // Retrieve the course and its students
      const course = await Course.findById(courseId)
        .populate({
          path: "studentsEnrolled",
          match: { batch: selectedBatch }, // Filter students by selectedBatch
          select: "firstName lastName email batch registrationFee",
        })
        .select("courseName startDate durationInMonths");
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Generate the list of course months
      const startDate = new Date(course.startDate);
      const courseMonths = [];
      for (let i = 0; i < course.durationInMonths; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        courseMonths.push(
          monthDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          })
        );
      }
  
      const unpaidStudents = [];
  
      // Loop through each student enrolled in the course
      for (const student of course.studentsEnrolled) {
        // Retrieve the latest payment for this student in this course
        const latestPayment = await Payment.findOne({
          student: student._id,
          course: courseId, // Ensure the course is correctly linked
        })
          .sort({ createdAt: -1 }) // Get the most recent payment
          .select("amount monthsPaid course discountType totalAmountPaid");
  
        if (!latestPayment) {
          console.log(
            `No payment found for student ${student.email} in course ${course.courseName}`
          );
        } else if (!latestPayment.course) {
          console.log(
            `Payment found but course is NULL for student ${student.email}`
          );
        }
  
        // Extract paid months
        const paidMonths = latestPayment ? latestPayment.monthsPaid : [];
        // Determine unpaid months
        const unpaidMonths = courseMonths.filter(
          (month) => !paidMonths.includes(month)
        );
        // Extract the latest monthly payment amount (fallback to `null` instead of 0)
        const monthlyPayment = latestPayment ? latestPayment.amount : null;
  
        unpaidStudents.push({
          student: {
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            batch: student.batch, // Include batch information
          },
          discountType: latestPayment ? latestPayment.discountType : null,
          registrationFee: student.registrationFee,
          courseId: course._id,
          courseName: course.courseName,
          paidMonths,
          unpaidMonths,
          totalAmountPaid: latestPayment ? latestPayment.totalAmountPaid : 0,
          monthlyPayment, // Corrected to ensure it reflects actual payments
        });
      }
  
      res.json({ unpaidStudents });
    } catch (error) {
      console.error("Error fetching unpaid students:", error);
      res.status(500).json({ message: "Server error" });
    }
  }),

 makePayment : asyncHandler(async (req, res) => {
    try {
      const { studentId, courseId } = req.params;
      const { amount, paymentType, selectedMonths } = req.body;
  
      if (!amount || !selectedMonths || selectedMonths.length === 0 || !paymentType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Find the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Check if the course is completed
      if (course.status === 'completed') {
        return res.status(400).json({ message: "This course is completed. No further payments can be made." });
      }
  
      // Find the batch related to the course (check if course has batches)
      const batch = await Batch.findOne({ course: courseId });
      if (!batch) {
        return res.status(400).json({ message: "No batch found for this course" });
      }
  
      // Find previous payments for this student in the course
      let existingPayment = await Payment.findOne({ student: studentId, course: courseId });
  
      // If no previous payments exist, create a new one
      if (!existingPayment) {
        // Assume the amount given in the request is the monthly fee (amount assigned during user creation)
        const newPayment = new Payment({
          student: studentId,
          course: courseId,
          amount, // This is the monthly payment amount
          totalAmountPaid: amount, // Initial payment, set as totalAmountPaid
          monthsPaid: selectedMonths, // Store the paid months
        });
        await newPayment.save();
      } else {
        // Retrieve the monthly payment amount from the existing payment record
        const monthlyPayment = existingPayment.amount;
        // Check if the received amount matches the expected monthly fee
        if (amount !== monthlyPayment) {
          return res.status(400).json({ message: "The amount does not match the monthly fee" });
        }
  
        // Push new months into the array without duplicates
        const updatedMonthsPaid = [...new Set([...existingPayment.monthsPaid, ...selectedMonths])];
  
        // Update the existing payment record
        await Payment.updateOne(
          { student: studentId, course: courseId },
          {
            $set: { monthsPaid: updatedMonthsPaid },
            $inc: { totalAmountPaid: amount }, // Increment the totalAmountPaid by the amount received
          }
        );
      }
  
      // Fetch all updated payments
      const payments = await Payment.find({ student: studentId, course: courseId });
  
      // Collect all paid months
      const paidMonths = payments.flatMap((payment) => payment.monthsPaid);
  
      // Generate all course months from the start date
      const startDate = new Date(course.startDate);
      const courseMonths = [];
      for (let i = 0; i < 3; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        courseMonths.push(
          monthDate.toLocaleString("default", { month: "short", year: "numeric" })
        );
      }
  
      // Identify unpaid months
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
  }),
  
  
  resetCertificationAndCourseStatus: asyncHandler(async (req, res) => {
    try {
      const { courseId } = req.params;
  
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required." });
      }
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
  
      // Check if the course is completed
      if (course.status === 'completed') {
        return res.status(400).json({ message: "This course is completed. You cannot reset the course status or revoke certificates." });
      }
  
      // Find all certificates for the course
      const certificates = await Certificate.find({ course: courseId });
  
      // Mark certificates as "revoked" instead of deleting them
      await Certificate.updateMany({ course: courseId }, { $set: { status: "revoked" } });
  
      // Set course status to "incomplete"
      course.courseStatus = "incomplete";
      await course.save();
  
      res.status(200).json({
        message: "Course reset. Certificates are now revoked but not deleted.",
      });
    } catch (error) {
      console.error("Error resetting course and certification status:", error);
      res.status(500).json({ message: "Server error" });
    }
  }),
  
  // Update Grade and ReGenerate Certeficate 

// Function to update grades and generate certificates
 updateGradesAndGenerateCertificates : asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { courseId, section, selectedBatch } = req.params;
    const studentsData = req.body;

    if (!courseId || !section || !selectedBatch) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    session.startTransaction();

    const sectionData = await Section.findOne({ course: courseId, section })
      .populate("course")
      .populate("students")
      .session(session);

    if (!sectionData) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Section not found." });
    }

    if (!sectionData.course || !sectionData.course.courseName) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Course data not found." });
    }

    // Check if the course is already completed
    if (sectionData.course.status === "completed") {
      await session.abortTransaction();
      return res.status(400).json({ message: "This course is completed. No grade updates or certificate generation allowed." });
    }

    let assessment = await Assessment.findOne({ course: courseId, section: sectionData._id }).session(session);

    if (!assessment) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Assessment not found." });
    }

    let certificatesGenerated = [];

    for (const studentData of studentsData) {
      const { studentId, assignmentScore, examScore, finalScore } = studentData;

      let studentAssessment = assessment.studentResults.find((sr) => sr.student.toString() === studentId);

      if (!studentAssessment) continue;

      studentAssessment.assignmentScore = Number(assignmentScore) || 0;
      studentAssessment.examScore = Number(examScore) || 0;
      studentAssessment.finalScore = Number(finalScore) || 0;
    }

    await assessment.save();

    for (const studentData of studentsData) {
      const { studentId, finalScore } = studentData;

      const existingCertificate = await Certificate.findOne({
        student: studentId,
        course: courseId,
      }).session(session);

      const certificateDir = path.join(__dirname, "../certificates");
      const sanitizedCourseName = sectionData.course.courseName.replace(/\s+/g, "_");
      const certificateFilePath = path.join(certificateDir, `${studentId}_${sanitizedCourseName}.pdf`);

      if (existingCertificate) {
        if (finalScore < 50) {
          // Attempt to delete the certificate file if it exists
          if (files.existsSync(certificateFilePath)) {
            try {
              await files.promises.unlink(certificateFilePath);
            } catch (err) {
              console.error("Error deleting certificate file:", err);
            }
          }

          // Delete the certificate record from the database
          await Certificate.deleteOne({ _id: existingCertificate._id }).session(session);
        }
      }

      if (finalScore < 50) continue;

      const student = sectionData.students.find((s) => s._id.toString() === studentId);
      if (!student) continue;

      const certificateId = `CERT-${Date.now()}-${studentId}-${Math.floor(Math.random() * 10000)}`;
      const hashCertificateId = crypto.createHash("sha256").update(certificateId).digest("hex");
      const verificationUrl = `https://makalla.com/verify/${hashCertificateId}`;

      if (!files.existsSync(certificateDir)) {
        await files.promises.mkdir(certificateDir, { recursive: true });
      }

      const pdfFilePath = path.join(certificateDir, `${studentId}_${sanitizedCourseName}.pdf`);

      await generateCertificatePDF(
        student._id,
        `${student.firstName} ${student.lastName}`,
        sectionData.course.courseName,
        certificateId,
        JSON.stringify({
          studentId,
          name: `${student.firstName} ${student.lastName}`,
          course: sectionData.course.courseName,
          certificateHash: hashCertificateId,
          verificationUrl,
        })
      );

      const newCertificate = new Certificate({
        student: studentId,
        course: courseId,
        certificateId,
        qrCode: verificationUrl,
      });

      await newCertificate.save();
      certificatesGenerated.push(newCertificate);
    }

    // **Update Batch Status to "completed"**
    await Batch.findByIdAndUpdate(selectedBatch, { batchStatus: "completed" }).session(session);

    await session.commitTransaction();
    res.status(200).json({
      message: "Grades updated. Certificates generated for eligible students. Batch marked as completed.",
      certificatesGenerated,
    });
  } catch (error) {
    console.error("Error updating grades and generating certificates:", error);
    await session.abortTransaction();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
}),


  createBlog: asyncHandler(async (req, res) => {
    try {
      const { title, subdescription, description } = req.body;

      // Check the images array before saving
      const images = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const blog = await Blog.create({
        title,
        subdescription,
        description,
        images, // Store image paths in the database
        user: req.user._id,
      });

      res.status(201).json(blog);
    } catch (error) {
      console.log("Error in createBlog controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),

  getBlogs: asyncHandler(async (req, res) => {
    try {
      const blogs = await Blog.find({}).populate({
        path: "user",
        select: "firstName email role",
      });
      res.status(201).json(blogs);
    } catch (error) {
      console.log("error in getBlogs controller", error.message);
      res.status(500).json({ message: "server error", error: error.message });
    }
  }),

  deleteBlog: asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      const blog = await Blog.findByIdAndDelete(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Check if blog has images and delete each image from local storage
      if (blog.images && blog.images.length > 0) {
        blog.images.forEach((image) => {
          const imagePath = path.join(__dirname, "../uploads", image); // Path to image file

          // Check if the image file exists before deleting
          if (files.existsSync(imagePath)) {
            files.unlink(imagePath, (err) => {
              if (err) {
                console.log(
                  "Error deleting the image from local storage:",
                  err
                );
              } else {
                console.log(`Image ${image} deleted from local storage`);
              }
            });
          }
        });
      }

      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.log("Error in deleteBlog controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),

  detailBlog: asyncHandler(async (req, res) => {
    try {
      const id = req.params.id.replace(":", "");
      const blog = await Blog.findById(id).populate(
        "user",
        "firstName email role"
      );
      if (!blog) {
        return res.status(404).json({ message: "blog not found" });
      }
      res.status(201).json(blog);
    } catch (error) {
      console.log("error in detailBlog controller", error.message);
      res.status(500).json({ message: "server error", error: error.message });
    }
  }),
  updateBlog: asyncHandler(async (req, res) => {
    const { editedPost } = req.body;  // Assuming editedPost is an object containing title, subdescription, and description
    try {
      const id = req.params.id;
      
      // Find the blog post by ID
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      // Update the blog post with the new data
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        title: editedPost.title,
        subdescription: editedPost.subdescription,
        description: editedPost.description,
      }, {
        new: true,  // Returns the updated blog post
      });
  
      res.status(200).json(updatedBlog);  // Send back the updated blog post
    } catch (error) {
      console.log("Error in updateBlog controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),
  
  like: asyncHandler(async (req, res) => {
    try {
      const { userId, blogId, itemType } = req.body;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Check if the user has already liked this blog
      const existingLike = await Like.findOne({ user: userId, blog: blogId });

      if (existingLike) {
        // If already liked, remove the like and decrement the like count
        await Like.findByIdAndDelete(existingLike._id);

        blog.likeCount = Math.max(0, blog.likeCount - 1); // Ensure likeCount doesn't go below 0
        await blog.save();

        return res
          .status(200)
          .json({ message: "Blog unliked", likeCount: blog.likeCount });
      } else {
        // If not liked, add a like and increment the like count
        const newLike = await Like.create({
          user: userId,
          blog: blogId,
          itemType: "blog",
        });

        blog.likeCount += 1;
        await blog.save();

        return res
          .status(200)
          .json({ message: "Blog liked", likeCount: blog.likeCount });
      }
    } catch (error) {
      // Handle errors
      console.error("Error liking the blog:", error);
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  }),
  createComment: asyncHandler(async (req, res) => {
    try {
      const { content, user, blog } = req.body;

      // Create the new comment
      const newComment = await Comment.create({
        content,
        user,
        blog,
      });

      // Find the blog associated with the comment
      const blogDoc = await Blog.findById(blog);
      if (!blogDoc) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Increment the comment count for the blog
      blogDoc.commentCount += 1;
      await blogDoc.save();

      res
        .status(201)
        .json({
          message: "Comment added",
          newComment,
          commentCount: blogDoc.commentCount,
        });
    } catch (error) {
      console.error("Error creating comment:", error);
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  }),
  getComments: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await Comment.find({ blog: id }).populate(
        "user",
        "name pic"
      ); // Adjust fields as needed
      res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching comments", error });
    }
  }),
  updateComment: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content },
        { new: true }
      );
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment", error });
    }
  }),
  deleteComment: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedComment = await Comment.findByIdAndDelete(id);
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error });
    }
  }),
  likeComment: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (!comment.likes.includes(userId)) {
        comment.likes.push(userId);
        comment.likeCount += 1;
        await comment.save();
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error liking comment", error });
    }
  }),
  unlikeComment: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter(
          (like) => like.toString() !== userId
        );
        comment.likeCount -= 1;
        await comment.save();
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error unliking comment", error });
    }
  }),
};

module.exports = AdminController;
