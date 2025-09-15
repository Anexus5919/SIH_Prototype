// server/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  // Courses
  addCourse, getCourses, getCourseById, updateCourse, deleteCourse,
  // Faculty
  addFaculty, getFaculty, getFacultyById, updateFaculty, deleteFaculty,
  // Rooms
  addRoom, getRooms, getRoomById, updateRoom, deleteRoom
} = require('../controllers/dataController');

// ==================
//   Course Routes
// ==================
// Anyone logged in can view courses
router.route('/courses').get(protect, getCourses);
router.route('/courses/:id').get(protect, getCourseById);
// Only admins can create, update, or delete courses
router.route('/courses').post(protect, adminOnly, addCourse);
router.route('/courses/:id').put(protect, adminOnly, updateCourse);
router.route('/courses/:id').delete(protect, adminOnly, deleteCourse);


// ==================
//   Faculty Routes
// ==================
router.route('/faculty').get(protect, getFaculty);
router.route('/faculty/:id').get(protect, getFacultyById);
router.route('/faculty').post(protect, adminOnly, addFaculty);
router.route('/faculty/:id').put(protect, adminOnly, updateFaculty);
router.route('/faculty/:id').delete(protect, adminOnly, deleteFaculty);


// ==================
//    Room Routes
// ==================
router.route('/rooms').get(protect, getRooms);
router.route('/rooms/:id').get(protect, getRoomById);
router.route('/rooms').post(protect, adminOnly, addRoom);
router.route('/rooms/:id').put(protect, adminOnly, updateRoom);
router.route('/rooms/:id').delete(protect, adminOnly, deleteRoom);


module.exports = router;