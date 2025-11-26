// routes/teacherDashboardRoutes.js

const express = require("express");

const router = express.Router();

const db = require("../db"); // <- yahi db tum auth / models me use kar rahe ho

/**************************************
 * 1. OVERVIEW (Profile + Timetable + Stats)
 * GET /api/teacher/overview/:teacherId
 **************************************/

router.get("/overview/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    // 1) Teacher profile
    const [teacherRows] = await db.query(
      "SELECT Teacher_id, Name, Email, Department, Phone FROM teachers WHERE Teacher_id = ?",
      [teacherId]
    );

    if (!teacherRows.length) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher = teacherRows[0];

    // 2) Weekly timetable (simple example: timetable table)
    // timetable: id, teacher_id, day, time_slot, subject, class_name
    const [timetableRows] = await db.query(
      "SELECT day, time_slot, subject, class_name FROM timetable WHERE teacher_id = ? ORDER BY day, time_slot",
      [teacherId]
    );

    // 3) Total students under teacher (via teacher_classes join students)
    // teacher_classes: teacher_id, class_id
    // students: id, Roll_no, Name, class_id
    const [studentCountRows] = await db.query(
      `
      SELECT COUNT(DISTINCT s.id) AS total_students
      FROM teacher_classes tc
      JOIN students s ON s.class_id = tc.class_id
      WHERE tc.teacher_id = ?
    `,
      [teacherId]
    );

    const totalStudents = studentCountRows[0]?.total_students || 0;

    // 4) Some small stats (optional)
    const [assignCountRows] = await db.query(
      "SELECT COUNT(*) AS total_assignments FROM assignments WHERE teacher_id = ?",
      [teacherId]
    );

    const [notesCountRows] = await db.query(
      "SELECT COUNT(*) AS total_notes FROM notes WHERE teacher_id = ?",
      [teacherId]
    );

    res.json({
      teacher,
      timetable: timetableRows,
      stats: {
        totalStudents,
        totalAssignments: assignCountRows[0]?.total_assignments || 0,
        totalNotes: notesCountRows[0]?.total_notes || 0,
      },
    });
  } catch (err) {
    console.error("OVERVIEW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**************************************
 * 2. ATTENDANCE
 * POST /api/teacher/attendance/mark
 * GET /api/teacher/attendance/:classId?date=YYYY-MM-DD
 **************************************/

// attendance table suggested columns:
// id, teacher_id, class_id, roll_no, date, status ('present' / 'absent')

router.post("/attendance/mark", async (req, res) => {
  const { teacherId, classId, date, records } = req.body;
  // records = [ { rollNo: 'BCA3B01', status: 'present' }, ... ]

  if (!teacherId || !classId || !date || !Array.isArray(records)) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    // Optional: delete old records for that date+class then insert fresh
    await db.query(
      "DELETE FROM attendance WHERE teacher_id = ? AND class_id = ? AND date = ?",
      [teacherId, classId, date]
    );

    for (const r of records) {
      await db.query(
        "INSERT INTO attendance (teacher_id, class_id, roll_no, date, status) VALUES (?, ?, ?, ?, ?)",
        [teacherId, classId, r.rollNo, date, r.status || "present"]
      );
    }

    res.json({ message: "Attendance saved" });
  } catch (err) {
    console.error("ATTENDANCE SAVE ERROR:", err);
    res.status(500).json({ message: "Error saving attendance" });
  }
});

router.get("/attendance/:classId", async (req, res) => {
  const classId = req.params.classId;
  const { date } = req.query; // optional

  try {
    let rows;
    if (date) {
      [rows] = await db.query(
        "SELECT * FROM attendance WHERE class_id = ? AND date = ? ORDER BY roll_no",
        [classId, date]
      );
    } else {
      [rows] = await db.query(
        "SELECT * FROM attendance WHERE class_id = ? ORDER BY date DESC, roll_no",
        [classId]
      );
    }

    res.json(rows);
  } catch (err) {
    console.error("ATTENDANCE FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

/**************************************
 * 3. ASSIGNMENTS
 * POST /api/teacher/assignments
 * GET /api/teacher/assignments/:classId
 **************************************/

// assignments: id, teacher_id, class_id, title, description, due_date, file_url, created_at

router.post("/assignments", async (req, res) => {
  const { teacherId, classId, title, description, dueDate, fileUrl } = req.body;

  if (!teacherId || !classId || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await db.query(
      `
      INSERT INTO assignments
      (teacher_id, class_id, title, description, due_date, file_url, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        teacherId,
        classId,
        title,
        description || "",
        dueDate || null,
        fileUrl || null
      ]
    );

    res.json({ message: "Assignment created" });
  } catch (err) {
    console.error("ASSIGN CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating assignment" });
  }
});

router.get("/assignments/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    const [rows] = await db.query(
      `SELECT * FROM assignments WHERE class_id = ? ORDER BY created_at DESC`,
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("ASSIGN FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

/**************************************
 * 4. NOTES
 * POST /api/teacher/notes
 * GET /api/teacher/notes/:classId
 **************************************/

// notes: id, teacher_id, class_id, title, description, file_url, is_book, created_at

router.post("/notes", async (req, res) => {
  const { teacherId, classId, title, description, fileUrl, isBook } = req.body;

  if (!teacherId || !classId || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await db.query(
      `INSERT INTO notes
       (teacher_id, class_id, title, description, file_url, is_book, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [teacherId, classId, title, description || "", fileUrl || null, !!isBook]
    );

    res.json({ message: "Note uploaded" });
  } catch (err) {
    console.error("NOTES CREATE ERROR:", err);
    res.status(500).json({ message: "Error uploading note" });
  }
});

router.get("/notes/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    const [rows] = await db.query(
      "SELECT * FROM notes WHERE class_id = ? ORDER BY created_at DESC",
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("NOTES FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

/**************************************
 * 5. REMINDERS (per teacher)
 * POST /api/teacher/reminders
 * GET /api/teacher/reminders/:teacherId
 * PUT /api/teacher/reminders/:id
 * DELETE /api/teacher/reminders/:id
 **************************************/

// reminders: id, teacher_id, title, date, created_at

router.post("/reminders", async (req, res) => {
  const { teacherId, title, date } = req.body;

  if (!teacherId || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await db.query(
      "INSERT INTO reminders (teacher_id, title, date, created_at) VALUES (?, ?, ?, NOW())",
      [teacherId, title, date || null]
    );

    res.json({ message: "Reminder created" });
  } catch (err) {
    console.error("REMINDER CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating reminder" });
  }
});

router.get("/reminders/:teacherId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM reminders WHERE teacher_id = ? ORDER BY date ASC",
      [req.params.teacherId]
    );

    res.json(rows);
  } catch (err) {
    console.error("REMINDER FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

router.put("/reminders/:id", async (req, res) => {
  const { title, date } = req.body;

  try {
    await db.query(
      "UPDATE reminders SET title = ?, date = ? WHERE id = ?",
      [title, date || null, req.params.id]
    );

    res.json({ message: "Reminder updated" });
  } catch (err) {
    console.error("REMINDER UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating reminder" });
  }
});

router.delete("/reminders/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM reminders WHERE id = ?", [req.params.id]);

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("REMINDER DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

/**************************************
 * 6. LEADERBOARD
 * GET /api/teacher/leaderboard/:classId
 **************************************/

// marks: id, roll_no, class_id, subject, marks
// attendance table already above
// assignment_submissions: id, assignment_id, roll_no, submitted_at, marks

router.get("/leaderboard/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    // Example: basic ranking by avg marks + attendance count + assignments submitted
    const [rows] = await db.query(
      `
      SELECT
        s.Roll_no,
        s.Name,
        -- total presents
        (SELECT COUNT(*) FROM attendance a
         WHERE a.roll_no = s.Roll_no AND a.class_id = ? AND a.status = 'present') AS presents,
        -- total lectures (for that class)
        (SELECT COUNT(*) FROM attendance a2
         WHERE a2.roll_no = s.Roll_no AND a2.class_id = ?) AS total_lectures,
        -- assignment submissions
        (SELECT COUNT(*) FROM assignment_submissions sub
         JOIN assignments asg ON asg.id = sub.assignment_id
         WHERE sub.roll_no = s.Roll_no AND asg.class_id = ?) AS assignments_done,
        -- average marks
        (SELECT AVG(marks) FROM marks
         WHERE class_id = ? AND roll_no = s.Roll_no) AS avg_marks
      FROM students s
      WHERE s.class_id = ?
      ORDER BY avg_marks DESC NULLS LAST
    `,
      [classId, classId, classId, classId, classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Error generating leaderboard" });
  }
});

/**************************************
 * 7. AI ASSISTANT (simple placeholder)
 * POST /api/teacher/assistant
 **************************************/

router.post("/assistant", async (req, res) => {
  const { question, teacherId } = req.body;

  if (!question) return res.status(400).json({ message: "Question required" });

  try {
    // Yahan tu baad me OpenAI / Gemini / apna ML model call kar sakta hai.
    const reply =
      "This is a placeholder AI response. In production, integrate an AI API here.";

    res.json({ reply });
  } catch (err) {
    console.error("ASSISTANT ERROR:", err);
    res.status(500).json({ message: "AI assistant error" });
  }
});

/**************************************
 * 8. SETTINGS (update teacher profile)
 * PUT /api/teacher/settings/:teacherId
 **************************************/

router.put("/settings/:teacherId", async (req, res) => {
  const teacherId = req.params.teacherId;
  const { name, phone, department } = req.body;

  try {
    await db.query(
      "UPDATE teachers SET Name = ?, Phone = ?, Department = ? WHERE Teacher_id = ?",
      [name || null, phone || null, department || null, teacherId]
    );

    const [rows] = await db.query(
      "SELECT Teacher_id, Name, Email, Department, Phone FROM teachers WHERE Teacher_id = ?",
      [teacherId]
    );

    res.json({ message: "Settings updated", teacher: rows[0] });
  } catch (err) {
    console.error("SETTINGS ERROR:", err);
    res.status(500).json({ message: "Error updating settings" });
  }
});

/**************************************
 * NEW: CHANGE PASSWORD
 * PUT /api/teacher/change-password
 **************************************/

router.put("/change-password", async (req, res) => {
  const { teacherId, currentPassword, newPassword } = req.body;

  if (!teacherId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bcrypt = require("bcryptjs");

    // Get current password hash from database
    const [rows] = await db.query(
      "SELECT password FROM teachers WHERE Teacher_id = ?",
      [teacherId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher = rows[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      teacher.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query("UPDATE teachers SET password = ? WHERE Teacher_id = ?", [
      hashedPassword,
      teacherId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("PASSWORD CHANGE ERROR:", err);
    res.status(500).json({ message: "Error changing password" });
  }
});

/**************************************
 * 9. CALENDAR (Teacher → Student)
 * POST /api/teacher/calendar
 * GET /api/teacher/calendar/:classId
 **************************************/

// calendar: id, class_id, teacher_id, title, date, type, description

router.post("/calendar", async (req, res) => {
  const { teacherId, classId, title, date, type, description } = req.body;

  if (!teacherId || !classId || !title || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await db.query(
      "INSERT INTO calendar (teacher_id, class_id, title, date, type, description) VALUES (?, ?, ?, ?, ?, ?)",
      [teacherId, classId, title, date, type || "exam", description || ""]
    );

    res.json({ message: "Event created" });
  } catch (err) {
    console.error("CALENDAR CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating event" });
  }
});

router.get("/calendar/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    const [rows] = await db.query(
      "SELECT * FROM calendar WHERE class_id = ? ORDER BY date ASC",
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("CALENDAR FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
