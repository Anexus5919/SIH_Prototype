const express = require('express');
const router = express.Router();
// --- ✅ FIX: Add 'getLatestTimetable' to the import list ---
const { getTimetableById, updateSlotStatus, getLatestTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

// Route to get a timetable by its ID
router.route('/:id').get(protect, getTimetableById);

// Route to update a specific class slot within a timetable
router.route('/:timetableId/slots/:slotId').put(protect, updateSlotStatus);

// Route to get the latest timetable
router.route('/latest').get(protect, getLatestTimetable);

module.exports = router;