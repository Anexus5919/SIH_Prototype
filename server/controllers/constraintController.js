// server/controllers/constraintController.js
const Constraint = require('../models/Constraint');

// Get the single constraints document, or create it if it doesn't exist
exports.getConstraints = async (req, res) => {
  try {
    let constraints = await Constraint.findOne({ singleton: 'global_constraints' });
    if (!constraints) {
      constraints = await Constraint.create({});
    }
    res.json(constraints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the constraints document
exports.updateConstraints = async (req, res) => {
  try {
    const constraints = await Constraint.findOneAndUpdate(
      { singleton: 'global_constraints' },
      req.body,
      { new: true, upsert: true, runValidators: true } // upsert:true creates it if it doesn't exist
    );
    res.json(constraints);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};