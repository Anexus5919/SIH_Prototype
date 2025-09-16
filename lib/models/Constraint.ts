import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for TypeScript type safety
export interface IConstraint extends Document {
  singleton: string;
  breakStartTime: string;
  breakEndTime: string;
  maxHoursPerDay: number;
  maxConsecutiveClasses: number;
}

const ConstraintSchema: Schema<IConstraint> = new Schema({
  singleton: {
    type: String,
    default: 'global_constraints',
    unique: true,
  },
  breakStartTime: {
    type: String,
    default: '13:00',
  },
  breakEndTime: {
    type: String,
    default: '14:00',
  },
  maxHoursPerDay: {
    type: Number,
    default: 2,
  },
  maxConsecutiveClasses: {
    type: Number,
    default: 3,
  },
});

// This pattern prevents Mongoose from recompiling the model on every hot-reload
const Constraint: Model<IConstraint> = mongoose.models.Constraint || mongoose.model<IConstraint>('Constraint', ConstraintSchema);

export default Constraint;