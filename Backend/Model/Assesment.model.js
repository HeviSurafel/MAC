const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true }, // Reference to Instructor
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  maxScore: { type: Number, required: true },
  studentSubmissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number },
    submittedAt: { type: Date },
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);
