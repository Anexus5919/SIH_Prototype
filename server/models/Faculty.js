// server/models/Faculty.js
const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  // Link to the user account
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  expertise: [{ // Array of course codes they can teach
    type: String,
  }],
  availability: { // Store preferred/unavailable slots
    type: Map,
    of: String,
  },
  maxWorkload: { // Max credits/hours per week
    type: Number,
    default: 16,
  },
});

module.exports = mongoose.model('Faculty', FacultySchema);