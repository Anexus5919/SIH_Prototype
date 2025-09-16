import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User'; // Import the IUser interface for referencing

// Interface for TypeScript type safety
export interface IFaculty extends Document {
  name: string;
  user?: IUser['_id']; // Optional link to the User model
  expertise: string[];
  maxWorkload: number;
}

const FacultySchema: Schema<IFaculty> = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  expertise: [{ 
    type: String 
  }],
  maxWorkload: { 
    type: Number, 
    default: 16 
  },
});

// This pattern prevents Mongoose from recompiling the model on every hot-reload
const Faculty: Model<IFaculty> = mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);

export default Faculty;