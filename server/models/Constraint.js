// server/models/Constraint.js
const mongoose = require('mongoose');

// This schema will store global rules for the timetable.
// We'll use a single document to store all settings.
const ConstraintSchema = new mongoose.Schema({
  // Unique key to ensure we only ever have one settings document
  singleton: {
    type: String,
    default: 'global_constraints',
    unique: true,
  },
  breakStartTime: {
    type: String, // e.g., "13:00"
    default: '13:00',
  },
  breakEndTime: {
    type: String, // e.g., "14:00"
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

module.exports = mongoose.model('Constraint', ConstraintSchema);