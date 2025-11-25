const express = require('express');
const router = express.Router();
const db = require('../db'); // Same db connection as Student.js

// GET all students - using EXACT same database as login
router.get('/students', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students ORDER BY roll_no');
    res.json(result.rows); // PostgreSQL returns .rows
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

module.exports = router;
