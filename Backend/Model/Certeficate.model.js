const mongoose=require("mongoose")
const certificateSchema =  mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Student
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to Course
    certificateId: { type: String, required: true, unique: true }, // Unique ID for certificate
    qrCode: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Certificate', certificateSchema);