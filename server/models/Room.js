// server/models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    enum: ['Lecture Hall', 'Lab', 'Seminar Room'],
    default: 'Lecture Hall',
  },
});

module.exports = mongoose.model('Room', RoomSchema);