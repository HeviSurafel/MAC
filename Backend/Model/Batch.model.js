const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  batchStatus: {
    type: String,
    enum: ["completed", "incomplete"],
    default: "incomplete",
  },
  startDate: { type: Date },
  endDate: { type: Date },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to enrolled students
});

module.exports = mongoose.model("Batch", batchSchema);
