const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  // Remove the reference to assessments and include assessments as an embedded array
  assessments: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    exam: { type: Number, required: true },
    assignment: { type: Number, required: true },
    FinalResult: { type: Number, required: true },
    studentSubmissions: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      score: { type: Number },
      submittedAt: { type: Date },
    }],
  }],
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }],
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
