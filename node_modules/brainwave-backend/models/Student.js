const db = require('../db');

// Get student by College_id (for login)
exports.findByCollegeId = async (college_id) => {
  const [rows] = await db.query("SELECT * FROM students WHERE College_id = ?", [college_id]);
  return rows[0];
};

// Add new student
exports.create = async (student) => {
  await db.query(
    "INSERT INTO students (Roll_no, Name, Course, Shift, Section, College_id, Year, email, password, isFirstLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      student.Roll_no,
      student.Name,
      student.Course,
      student.Shift,
      student.Section,
      student.College_id,
      student.Year,
      student.email,
      student.password,
      student.isFirstLogin,
    ]
  );
  return exports.findByCollegeId(student.College_id);
};

// Update password
exports.updatePassword = async (college_id, password) => {
  await db.query("UPDATE students SET password = ?, isFirstLogin = 0 WHERE College_id = ?", [password, college_id]);
};
