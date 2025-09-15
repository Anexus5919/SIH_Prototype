// server/routes/constraintRoutes.js
const express = require('express');
const router = express.Router();
const { getConstraints, updateConstraints } = require('../controllers/constraintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect routes so only admins can view or change settings
router.route('/').get(protect, adminOnly, getConstraints);
router.route('/').put(protect, adminOnly, updateConstraints);

module.exports = router;