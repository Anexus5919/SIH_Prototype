import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for TypeScript type safety
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Student' | 'Faculty' | 'Admin';
  date: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Faculty', 'Student'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// --- ❗ THIS IS THE FIX ❗ ---
// This pattern prevents Mongoose from recompiling the model on every hot-reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;