// server/routes/generatorRoutes.js
const express = require('express');
const router = express.Router();
const { generateTimetable } = require('../controllers/generatorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/generate
// @desc    Trigger the AI to generate a new timetable
// @access  Private/Admin
router.post('/', protect, adminOnly, generateTimetable);

module.exports = router;