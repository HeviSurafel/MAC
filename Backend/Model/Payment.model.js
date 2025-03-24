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
    discount: { type: Number, default: 0 },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    discountType: {
      type: String,
      enum: ["staff", "relative", "friend","other"],
      default: null,
    },
    amount: { type: Number, required: true },
    monthsPaid: { type: [String], default: [] }, // ✅ Store multiple paid months
    totalAmountPaid: { type: Number, default: 0 }, // ✅ Store total amount paid
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
