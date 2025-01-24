import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [{
    type: String, // You can switch this to ObjectId if you're referencing other collections
  }],
  designation: {
    type: String,
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

// Update the updatedAt timestamp on save or update
teacherSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Ensure `updatedAt` is also updated when the document is modified
teacherSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
