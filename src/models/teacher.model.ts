import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [{
    type: String, 
  }],
  designation: {
    type: String,
  }
},{timestamps:true});


export default mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
