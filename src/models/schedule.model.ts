import mongoose, { Document, Schema, Model } from "mongoose";

// TimeSlot interface for each time slot in the timetable
interface TimeSlot {
  startTime: string;
  endTime: string;
  subject: string; // Subject name (e.g., "Computer Science")
  teacher: mongoose.Schema.Types.ObjectId[]; // Array of teacher IDs (if needed)
}
// DaySchedule interface for each day in the semester, containing time slots
interface DaySchedule {
  dayName: string; // Day of the week (e.g., "Monday", "Tuesday")
  slots: TimeSlot[]; // List of time slots for the day
}

// ScheduleType interface for the overall timetable
export interface ScheduleType extends Document {
  course: string; // Course name (e.g., "BCA", "BBA")
  semesters: { semester: number; schedule: DaySchedule[] }[]; // List of semesters and their schedules
}
// Mongoose Schema for the Schedule model
const ScheduleSchema = new Schema<ScheduleType>(
  {
    course: { type: String, required: true }, // Course name (e.g., "BCA", "BBA")
    semesters: [
      {
        semester: { type: Number, required: true }, // Semester (1, 2, etc.)
        schedule: [
          {
            dayName: { type: String, required: true }, // Day of the week (e.g., "Monday", "Tuesday")
            slots: [
              {
                startTime: { type: String, required: true }, // Start time (e.g., "09:00 AM")
                endTime: { type: String, required: true }, // End time (e.g., "09:30 AM")
                subject: { type: String, default: "No Data" }, // Subject name
                teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", default: null }] // Array of Teacher ObjectId references
              }
            ]
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

// Mongoose Model for the Schedule Schema
const ScheduleModel: Model<ScheduleType> =
  mongoose.models.Schedule as Model<ScheduleType> ||
  mongoose.model<ScheduleType>("Schedule", ScheduleSchema);

export default ScheduleModel;
