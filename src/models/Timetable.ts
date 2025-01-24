import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  data: {
    type: [
      [
        {
          _id:String,
          teacher: String,
          subject: String,
          day: String,
          start: String,
          end: String,
          teacherCourse:String,
          teacherSemester:String
        },
      ],
    ],
    default: Array(5).fill(Array(6).fill(null)),
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

// Compound index for unique course-semester combinations
timetableSchema.index({ course: 1, semester: 1 }, { unique: true });

// Update the updatedAt timestamp on save
timetableSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.MyTimetable ||
  mongoose.model("MyTimetable", timetableSchema);
