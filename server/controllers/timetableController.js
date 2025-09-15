const Timetable = require('../models/Timetable');

// This function gets a specific timetable by its ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('schedule.course', 'courseCode title')
      .populate('schedule.faculty', 'name')
      .populate('schedule.room', 'roomNumber');
      
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// This NEW function updates a specific slot within a timetable
exports.updateSlotStatus = async (req, res) => {
  try {
    const { timetableId, slotId } = req.params;
    const { status, comment } = req.body;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Use the .id() method to find the specific sub-document in the schedule array
    const slot = timetable.schedule.id(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Class slot not found' });
    }
    
    // Update the fields
    slot.status = status;
    slot.comment = comment;

    // Save the parent document
    await timetable.save();
    
    // Return the updated slot
    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// This NEW function gets the most recently created timetable
exports.getLatestTimetable = async (req, res) => {
  try {
    const latestTimetable = await Timetable.findOne()
      .sort({ createdAt: -1 }) // Find the newest one
      .populate('schedule.course', 'courseCode title')
      .populate('schedule.faculty', 'name')
      .populate('schedule.room', 'roomNumber');
      
    if (!latestTimetable) {
      return res.status(404).json({ message: 'No timetables found in the system.' });
    }
    
    res.json(latestTimetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};