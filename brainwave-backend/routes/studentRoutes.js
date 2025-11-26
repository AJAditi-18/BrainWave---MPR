const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL client (same as login)

// =============================
// 1. STUDENT OVERVIEW
// =============================
router.get("/overview/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const studentResult = await db.query(
      "SELECT id, roll_no, name, email, course, section, year, college_id FROM students WHERE id = $1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentResult.rows[0];

    // CGPA
    const cgpaRes = await db.query(
      "SELECT cgpa FROM ipuranklist WHERE roll_no = $1 LIMIT 1",
      [student.roll_no]
    );
    const cgpa = cgpaRes.rows[0]?.cgpa || null;

    // Attendance
    const attendanceRes = await db.query(
      `SELECT 
        SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) AS presents,
        COUNT(*) AS total_lectures
       FROM attendance
       WHERE roll_no = $1`,
      [student.roll_no]
    );

    const presents = attendanceRes.rows[0]?.presents || 0;
    const totalLectures = attendanceRes.rows[0]?.total_lectures || 0;
    const attendancePercent =
      totalLectures > 0 ? Math.round((presents / totalLectures) * 100) : 0;

    // Books borrowed
    const booksRes = await db.query(
      "SELECT COUNT(*) AS borrowed_count FROM borrow_records WHERE student_id = $1 AND status='borrowed'",
      [studentId]
    );

    // Pending assignments
    const pendingRes = await db.query(
      `SELECT COUNT(*) AS pending 
       FROM assignments a
       LEFT JOIN assignment_submissions s
         ON s.assignment_id = a.id AND s.roll_no = $1
       WHERE a.class_id = (SELECT class_id FROM students WHERE id=$2)
         AND s.id IS NULL`,
      [student.roll_no, studentId]
    );

    res.json({
      profile: student,
      cgpa,
      attendance: {
        presents,
        totalLectures,
        attendancePercent,
      },
      booksBorrowed: parseInt(booksRes.rows[0].borrowed_count),
      assignmentsPending: parseInt(pendingRes.rows[0].pending),
    });
  } catch (error) {
    console.error("OVERVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// 2. COURSEWORK (notes + assignments)
// =============================
router.get("/coursework/:studentId", async (req, res) => {
  const id = req.params.studentId;

  try {
    const classRes = await db.query(
      "SELECT class_id, roll_no FROM students WHERE id = $1",
      [id]
    );

    if (classRes.rows.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const classId = classRes.rows[0].class_id;
    const rollNo = classRes.rows[0].roll_no;

    const notes = await db.query(
      "SELECT * FROM notes WHERE class_id = $1 ORDER BY created_at DESC",
      [classId]
    );

    const assignments = global.__TEMP_ASSIGNMENTS__[classId] || [];


    res.json({
      notes: notes.rows,
      assignments: assignments.rows,
    });
  } catch (err) {
    console.error("COURSEWORK ERROR:", err);
    res.status(500).json({ message: "Error fetching coursework" });
  }
});

// =============================
// 3. LIBRARY
// =============================
router.get("/library/history/:studentId", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT br.*, lb.title, lb.author 
       FROM borrow_records br
       JOIN library_books lb ON lb.id = br.book_id
       WHERE br.student_id = $1
       ORDER BY borrowed_date DESC`,
      [req.params.studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("LIBRARY ERROR:", err);
    res.status(500).json({ message: "Error fetching library history" });
  }
});

// DIGITAL LIBRARY
router.get("/library/digital-books", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, description, file_url FROM notes WHERE is_book = TRUE ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DIGITAL BOOKS ERROR:", err);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// SAMPLE FILE PATH (your uploaded file)
router.get("/library/sample-image", (req, res) => {
  const filePath = "/mnt/data/ebaa9f3a-9f30-4199-aa17-fa95ebd74dc9.png";
  res.json({ file_url: filePath });
});

// =============================
// 4. MARKETPLACE
// =============================
router.get("/marketplace/all", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, s.name AS student_name
       FROM marketplace m
       LEFT JOIN students s ON s.id = m.student_id
       ORDER BY m.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("MARKETPLACE ERROR:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// =============================
// 5. ALUMNI
// =============================
router.get("/alumni", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM alumni ORDER BY batch DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("ALUMNI ERROR:", err);
    res.status(500).json({ message: "Error fetching alumni" });
  }
});

// =============================
// 6. STUDENT CALENDAR
// =============================
router.get("/calendar/:studentId", async (req, res) => {
  try {
    const classRes = await db.query(
      "SELECT class_id FROM students WHERE id = $1",
      [req.params.studentId]
    );

    const classId = classRes.rows[0].class_id;

    const result = await db.query(
      "SELECT * FROM calendar WHERE class_id = $1 ORDER BY date ASC",
      [classId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("CALENDAR ERROR:", err);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// =============================
// 7. LEADERBOARD
// =============================
router.get("/leaderboard/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    const result = await db.query(
      `SELECT 
        s.roll_no,
        s.name,
        (SELECT COUNT(*) FROM attendance a WHERE a.roll_no = s.roll_no AND a.class_id=$1 AND a.status='present') AS presents,
        (SELECT COUNT(*) FROM attendance a2 WHERE a2.roll_no = s.roll_no AND a2.class_id=$1) AS total_lectures,
        (SELECT AVG(marks) FROM marks WHERE roll_no = s.roll_no AND class_id=$1) AS avg_marks
       FROM students s
       WHERE s.class_id = $1
       ORDER BY avg_marks DESC NULLS LAST`,
      [classId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Error generating leaderboard" });
  }
});

module.exports = router;
