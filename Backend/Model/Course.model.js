const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  // academicDirector: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicDirector' }, // Reference to Academic Director
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }], // Reference to Instructors
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to Students
    default: [],
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
