import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICourse } from './Course';
import { IFaculty } from './Faculty';
import { IRoom } from './Room';

// Interface for the sub-document
interface ITimeSlot extends Document {
  day: string;
  time: string;
  course?: ICourse['_id'];
  faculty?: IFaculty['_id'];
  room?: IRoom['_id'];
  status: 'Scheduled' | 'Cancelled';
  comment: string;
}

// Interface for the main document
export interface ITimetable extends Document {
  program: string;
  semester: string;
  schedule: ITimeSlot[];
  version: number;
  createdAt: Date;
}

const TimeSlotSchema: Schema<ITimeSlot> = new Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  status: { type: String, enum: ['Scheduled', 'Cancelled'], default: 'Scheduled' },
  comment: { type: String, default: '' },
});

const TimetableSchema: Schema<ITimetable> = new Schema({
  program: { type: String, required: true },
  semester: { type: String, required: true },
  schedule: [TimeSlotSchema],
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now, index: -1 },
});

const Timetable: Model<ITimetable> = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema);

export default Timetable;