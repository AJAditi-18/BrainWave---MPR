// 🔥 TEMP in-memory assignment store
global.__ASSIGNMENTS__ = {};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const db = require('./db');

// ✅ VERY IMPORTANT – BODY LIMIT
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// agar body-parser use ho raha hai to
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Student Dashboard Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);

// Static files serve (Digital Library, Notes, Books, Images)
app.use('/files', express.static('/mnt/data'));

// Teacher Dashboard Routes
const teacherDashboardRoutes = require('./routes/teacherRoutes');
app.use('/api/teacher', teacherDashboardRoutes);

// ✅ ADD THIS: Students Route (fetch all students from same DB as login)
app.get('/api/students', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students ORDER BY roll_no');
    res.json(result.rows); // PostgreSQL returns .rows
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Brainwave Backend API Running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
