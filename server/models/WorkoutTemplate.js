import mongoose from "mongoose";

const WorkoutTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
  },
  workoutName: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
  },
  reps: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("WorkoutTemplate", WorkoutTemplateSchema);

