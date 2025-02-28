const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    amount: { type: Number, required: true },
    monthsPaid: { type: [String], default: [] }, // ✅ Store multiple paid months
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
