const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema(
  {
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course", 
      required: true 
    }, // Reference to Course

    section: { 
      type: String, 
      enum: ["A", "B", "C", "D", "E", "F", "G"], 
      required: true 
    }, // Section letter (fixed values)

    instructors: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Instructor" 
    }], // References to Instructors

    students: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }], // References to Students
  },
  { timestamps: true }
);

// Ensure a course cannot have duplicate sections
sectionSchema.index({ course: 1, section: 1 }, { unique: true });

// Middleware to prevent duplicate instructors in the same section
sectionSchema.pre("save", function (next) {
  const uniqueInstructors = new Set(this.instructors.map(id => id.toString()));
  if (uniqueInstructors.size !== this.instructors.length) {
    return next(new Error("Duplicate instructor assignment detected!"));
  }
  next();
});

module.exports = mongoose.model("Section", sectionSchema);
