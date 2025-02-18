const mongoose = require("mongoose");

const studentRegistrationSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Student
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
});

module.exports = mongoose.model('StudentRegistration', studentRegistrationSchema);
