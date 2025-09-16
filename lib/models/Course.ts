import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for TypeScript type safety
export interface ICourse extends Document {
  courseCode: string;
  title: string;
  credits: number;
  courseType: 'Theory' | 'Practical' | 'Lab' | 'Skill' | 'Value';
  program: string;
  contactHours: number;
  requiresLab: boolean;
}

const CourseSchema: Schema<ICourse> = new Schema({
  courseCode: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  credits: { 
    type: Number, 
    required: true 
  },
  courseType: {
    type: String,
    enum: ['Theory', 'Practical', 'Lab', 'Skill', 'Value'],
    required: true,
  },
  program: { 
    type: String, 
    required: true 
  },
  contactHours: {
    type: Number,
    required: true,
    default: 3,
  },
  requiresLab: {
    type: Boolean,
    default: false,
  },
});

// This pattern prevents Mongoose from recompiling the model on every hot-reload
const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;