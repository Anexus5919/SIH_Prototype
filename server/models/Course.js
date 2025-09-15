// server/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  courseType: {
    type: String,
    enum: ['Theory', 'Practical', 'Lab', 'Skill', 'Value'],
    required: true,
  },
  // You can link courses to specific programs (e.g., FYUP, B.Ed.)
  program: {
    type: String,
    required: true,
  },
  contactHours: { // **NEW**: Total hours per week for this course
    type: Number,
    required: true,
    default: 3,
  },
  requiresLab: { // **NEW**: Does this course need a lab room?
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Course', CourseSchema);