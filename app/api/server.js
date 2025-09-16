const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 1. Make sure cors is required
const connectDB = require('../../lib/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- ❗ CRITICAL FIX ❗ ---
// 2. Use the cors middleware. This MUST come BEFORE your routes.
// This tells your server to accept requests from other origins (like your frontend).
app.use(cors());
// -------------------------

// Middleware to parse JSON
app.use(express.json());

// Define API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/generate', require('./routes/generatorRoutes'));
app.use('/api/constraints', require('./routes/constraintRoutes'));
app.use('/api/timetables', require('./routes/timetableRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));