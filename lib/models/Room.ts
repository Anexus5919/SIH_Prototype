import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for TypeScript type safety
export interface IRoom extends Document {
  roomNumber: string;
  capacity: number;
  roomType: 'Lecture Hall' | 'Lab' | 'Seminar Room';
}

const RoomSchema: Schema<IRoom> = new Schema({
  roomNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  roomType: {
    type: String,
    enum: ['Lecture Hall', 'Lab', 'Seminar Room'],
    default: 'Lecture Hall',
  },
});

// This pattern prevents Mongoose from recompiling the model on every hot-reload
const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;