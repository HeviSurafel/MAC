const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Allow null if no instructor is assigned
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    durationInMonths: { type: Number, default: 3 },
    cost: { type: Number, required: true },
    registrationFee: { type: Number, default: 500 },
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
