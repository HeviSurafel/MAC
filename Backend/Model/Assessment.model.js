const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    examWeight: { type: Number, required: true, default: 0 },
    assignmentWeight: { type: Number, required: true, default: 0 },
    finalWeight: { type: Number, required: true, default: 0 },
    studentResults: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        assignmentScore: { type: Number, default: 0 },
        examScore: { type: Number, default: 0 },
        finalScore: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
