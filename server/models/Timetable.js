const mongoose = require('mongoose');

// We REMOVE the '{ _id: false }' option to allow each slot to have a unique ID
const TimeSlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  
  // --- NEW FIELDS ---
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled'],
    default: 'Scheduled',
  },
  comment: {
    type: String,
    default: '',
  },
});

const TimetableSchema = new mongoose.Schema({
  program: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  schedule: [TimeSlotSchema],
  version: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Timetable', TimetableSchema);