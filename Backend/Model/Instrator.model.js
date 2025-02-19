const mongoose = require("mongoose");

const instructorSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Reference to Courses
}, {
  timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema);
