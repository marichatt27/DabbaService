const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    duration: {
      type: String,
      enum: ["Weekly", "Monthly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Cancelled", "Delivered"],
      default: "Active",
    },
    skippedDates: {
      type: [String], // Array of YYYY-MM-DD date strings
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);