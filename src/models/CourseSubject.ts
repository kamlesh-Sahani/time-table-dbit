import mongoose from "mongoose";

const courseSubjectSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  semesters: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp on save
courseSubjectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.CourseSubject ||
  mongoose.model("CourseSubject", courseSubjectSchema);
