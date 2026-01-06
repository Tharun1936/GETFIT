import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  targetCalories: {
    type: Number,
    default: 0,
  },
  targetWorkouts: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Goal", GoalSchema);

