const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// This route allows an admin to get a list of all users
router.route('/').get(protect, adminOnly, getUsers);

module.exports = router;