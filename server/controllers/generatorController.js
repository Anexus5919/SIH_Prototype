const TimetableGenerator = require('../ai/generator');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Room = require('../models/Room');
const Timetable = require('../models/Timetable');
const Constraint = require('../models/Constraint');

exports.generateTimetable = async (req, res) => {
  try {
    // 1. Fetch all necessary data
    const courses = await Course.find();
    const faculty = await Faculty.find();
    const rooms = await Room.find();
    const constraints = await Constraint.findOne({ singleton: 'global_constraints' });

    if (courses.length === 0 || faculty.length === 0 || rooms.length === 0) {
      return res.status(400).json({ message: "Not enough data (courses, faculty, rooms) to generate a timetable." });
    }

    // 2. Run the AI generator
    console.log("Starting timetable generation...");
    const generator = new TimetableGenerator(courses, faculty, rooms, constraints);
    const bestTimetable = await generator.run();
    console.log("Timetable generation complete.");

    // 3. Save the new timetable
    const { program, semester } = req.body;
    let newTimetable = new Timetable({
      program,
      semester,
      schedule: bestTimetable.schedule,
    });
    await newTimetable.save();
    
    // --- ❗ CRITICAL FIX ❗ ---
    // After saving, re-fetch the document and populate the linked fields.
    const populatedTimetable = await Timetable.findById(newTimetable._id)
      .populate({
          path: 'schedule.course',
          model: 'Course',
          select: 'courseCode title' // Select which fields to include
      })
      .populate({
          path: 'schedule.faculty',
          model: 'Faculty',
          select: 'name'
      })
      .populate({
          path: 'schedule.room',
          model: 'Room',
          select: 'roomNumber'
      });
    // -------------------------

    // 4. Send the complete, populated timetable back to the client
    res.status(201).json({
      message: "Timetable generated successfully!",
      fitness: bestTimetable.fitness,
      timetableId: populatedTimetable._id,
      timetable: populatedTimetable, // Send the populated version
    });

  } catch (err) {
    console.error("Error during timetable generation:", err);
    res.status(500).json({ error: err.message });
  }
};