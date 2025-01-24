import mongoose from 'mongoose';

const teacherSubjectSchema = new mongoose.Schema({
  teachers: {
    type: String,
  },
  subjects: [{
    type: String,
  }],
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
teacherSubjectSchema.index({ course: 1, semester: 1 }, { unique: true });

// Update the updatedAt timestamp on save
teacherSubjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.TeacherSubject || mongoose.model('TeacherSubject', teacherSubjectSchema);