import mongoose from 'mongoose';

const timeSchema = new mongoose.Schema({
  course: { type: String, required: true },
  semester: { type: String, required: true },
  slots: [{
    start: { type: String, required: true },
    end: { type: String, required: true }
  }]
});

// Ensure unique combination of course and semester
timeSchema.index({ course: 1, semester: 1 }, { unique: true });

const Time = mongoose.models.Time || mongoose.model('Time', timeSchema);

export default Time;