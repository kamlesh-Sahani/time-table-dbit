import mongoose, { Document, Schema, Model } from "mongoose";

interface TimeSlot {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: mongoose.Schema.Types.ObjectId[]; // Array of teacher IDs
}

interface DaySchedule {
  dayName: string; // Example: "Monday", "Tuesday"
  slots: TimeSlot[];
}

export interface ScheduleType extends Document {
  course: string;
  semester: number;
  schedule: DaySchedule[];
}

// Mongoose Schema
const ScheduleSchema = new Schema<ScheduleType>(
  {
    course: { type: String, required: true }, // Example: BCA, BBA, BCom
    semester: { type: Number, required: true }, // Example: 1, 2, 3, 4, 5, 6
    schedule: [
      {
        dayName: { type: String, required: true }, // Example: "Monday", "Tuesday"
        slots: [
          {
            startTime: { type: String, required: true }, // Example: "09:00 AM"
            endTime: { type: String, required: true }, // Example: "09:30 AM"
            subject: { type: String, default: "No Data" }, // Example: "C++"
            teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", default: null }] // Reference to User model (teacher)
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const ScheduleModel: Model<ScheduleType> =
  mongoose.models.Schedule as Model<ScheduleType> ||
  mongoose.model<ScheduleType>("Schedule", ScheduleSchema);

export default ScheduleModel;
