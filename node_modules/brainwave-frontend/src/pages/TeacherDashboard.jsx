import React, { useState, useMemo } from "react";
import OverviewPanel from "./Panels/OverviewPanel";
import AttendancePanel from "./Panels/AttendancePanel";
import AssignmentsPanel from "./Panels/AssignmentsPanel";
import NotesPanel from "./Panels/NotesPanel";
import RemindersPanel from "./Panels/RemindersPanel";
import SettingsPanel from "./Panels/SettingsPanel";
import StudentsPanel from "./Panels/StudentsPanel";
import TimetableEditor from "./Panels/TimetableEditor";
import {
  BookOpenIcon, DocumentTextIcon, BellIcon, UserGroupIcon, HomeIcon,
  CalendarIcon, ClipboardDocumentCheckIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// DUMMY DATA
const classMap = [
  {
    classKey: "bca3b_software",
    className: "BCA III B",
    subject: "Software Engineering",
    students: [
      { rollNo: "BCA3B01", name: "Harsh Mehta" },
      { rollNo: "BCA3B02", name: "Sneha Patel" },
      { rollNo: "BCA3B03", name: "Ankit Sharma" },
    ],
  },
  {
    classKey: "mca2a_dbms",
    className: "MCA II A",
    subject: "Database Management",
    students: [
      { rollNo: "MCA2A01", name: "Priya Jain" },
      { rollNo: "MCA2A02", name: "Rahul Agarwal" },
      { rollNo: "MCA2A03", name: "Simran Kaur" },
    ],
  },
];

function getLastNDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().substr(0, 10));
  }
  return dates;
}

const attendanceDates = getLastNDates(30);

const teacherProfile = {
  name: "Prof. Demo Teacher",
  email: "teacher@test.com",
  department: "Computer Science",
  employeeId: "EMP001",
  phone: "+91 9876543210",
  subjects: ["Data Structures", "Software Engineering", "Database Management"],
};

const initialTimetable = [
  {
    day: "Monday",
    slots: [
      { time: "9:00-10:00", subject: "Data Structures", class: "CS-A" },
      { time: "11:00-12:00", subject: "Software Engg.", class: "BCA-B" },
    ],
  },
  {
    day: "Tuesday",
    slots: [{ time: "10:00-11:00", subject: "DBMS", class: "MCA-A" }],
  },
  {
    day: "Wednesday",
    slots: [{ time: "9:00-10:00", subject: "Software Engg.", class: "BCA-B" }],
  },
  {
    day: "Thursday",
    slots: [
      { time: "11:00-12:00", subject: "DBMS", class: "MCA-B" },
      { time: "3:00-4:00", subject: "Data Structures", class: "CS-A" },
    ],
  },
  {
    day: "Friday",
    slots: [{ time: "12:00-1:00", subject: "Software Engg.", class: "BCA-B" }],
  },
];

const classSubjectOptions = classMap.map((cls) => ({
  classKey: cls.classKey,
  label: `${cls.className} - ${cls.subject}`,
  students: cls.students,
}));

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // Shared state
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(false);

  // Attendance
  const [selectedClassKey, setSelectedClassKey] = useState(classMap[0].classKey);
  const [attendance, setAttendance] = useState({});
  const [noClassDates, setNoClassDates] = useState({});

  // Assignments
  const [assignmentsByClass, setAssignmentsByClass] = useState({});
  const [assignmentFormClass, setAssignmentFormClass] = useState(classSubjectOptions[0].classKey);
  const [newAssignment, setNewAssignment] = useState({ name: "", due: "" });

  // Notes
  const [notesByClass, setNotesByClass] = useState({});
  const [notesFormClass, setNotesFormClass] = useState(classSubjectOptions[0].classKey);
  const [newNote, setNewNote] = useState({ title: "" });

  // Reminders
  const [reminders, setReminders] = useState([{ id: 1, title: "Faculty meeting tomorrow at 10 AM", date: "2025-11-08" }]);
  const [newReminder, setNewReminder] = useState({ title: "", date: "" });
  const [editingReminder, setEditingReminder] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // Settings
  const [editProfile, setEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ ...teacherProfile });

  // Timetable
  const [timetable, setTimetable] = useState(initialTimetable);
  const [showTimetableEditor, setShowTimetableEditor] = useState(false);

  // Students
  const [studentAssignments, setStudentAssignments] = useState({});
  const [studentMarks, setStudentMarks] = useState({});

  // Calculated values
  const totalAssignments = useMemo(() => Object.values(assignmentsByClass).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0), [assignmentsByClass]);
  const totalNotes = useMemo(() => Object.values(notesByClass).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0), [notesByClass]);
  const totalStudents = useMemo(() => classMap.reduce((sum, cls) => sum + cls.students.length, 0), []);

  const navItems = [
    { id: "overview", icon: <HomeIcon className="h-6 w-6" />, text: "Overview" },
    { id: "attendance", icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />, text: "Attendance" },
    { id: "assignments", icon: <DocumentTextIcon className="h-6 w-6" />, text: "Assignments" },
    { id: "notes", icon: <BookOpenIcon className="h-6 w-6" />, text: "Notes" },
    { id: "reminders", icon: <BellIcon className="h-6 w-6" />, text: "Reminders" },
    { id: "students", icon: <UserGroupIcon className="h-6 w-6" />, text: "Students" },
    { id: "settings", icon: <Cog6ToothIcon className="h-6 w-6" />, text: "Settings" }
  ];

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-[#edf7fa] to-[#e0f2fe] text-gray-900"}`}>
      <aside className={`${isDark ? "bg-gray-800" : "bg-white"} shadow-lg w-64 p-6 flex flex-col gap-6 sticky top-0 h-screen`}>
        <div className="font-black tracking-tight text-cyan-600 text-xl mb-6 flex items-center gap-2">
          🎓 BrainWave
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
                activeTab === item.id ?
                  (isDark ? "bg-cyan-900 text-cyan-100" : "bg-cyan-50 text-cyan-900") :
                  (isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-cyan-100")}`}>
              {item.icon}{item.text}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDark ? "bg-cyan-900" : "bg-cyan-100"} rounded-full flex items-center justify-center font-bold text-cyan-700`}>
              {user?.fullName?.[0] || "T"}
            </div>
            <div>
              <div className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
                {user?.fullName || teacherProfile.name.split(" ")[0]}
              </div>
              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>Teacher</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />Logout
          </button>
        </div>
      </aside>

      <main className={`flex-1 px-10 py-8 overflow-y-auto ${isDark ? "bg-gray-900" : ""}`}>
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          {navItems.find((item) => item.id === activeTab)?.text}
        </h1>

        {activeTab === "overview" && <OverviewPanel isDark={isDark} teacherProfile={profileDraft} timetable={timetable}
          totalAssignments={totalAssignments} totalNotes={totalNotes} totalStudents={totalStudents}
          onEditTimetable={() => setShowTimetableEditor(true)}
        />}
        {activeTab === "attendance" && <AttendancePanel {...{
          isDark, classMap, attendance, setAttendance, selectedClassKey, setSelectedClassKey,
          noClassDates, setNoClassDates, attendanceDates
        }} />}
        {activeTab === "assignments" && <AssignmentsPanel {...{
          isDark, classSubjectOptions, assignmentsByClass, setAssignmentsByClass,
          assignmentFormClass, setAssignmentFormClass, newAssignment, setNewAssignment
        }} />}
        {activeTab === "notes" && <NotesPanel {...{
          isDark, classSubjectOptions, notesByClass, setNotesByClass,
          notesFormClass, setNotesFormClass, newNote, setNewNote
        }} />}
        {activeTab === "reminders" && <RemindersPanel {...{
          isDark, reminders, setReminders, newReminder, setNewReminder,
          editingReminder, setEditingReminder, editDraft, setEditDraft
        }} />}
        {activeTab === "students" && <StudentsPanel {...{
          isDark, classMap, assignmentsByClass, studentAssignments, setStudentAssignments,
          studentMarks, setStudentMarks, attendance, attendanceDates
        }} />}
        {activeTab === "settings" && <SettingsPanel {...{
          isDark, setIsDark, profileDraft, setProfileDraft,
          editProfile, setEditProfile, handleLogout
        }} />}
      </main>

      {/* Timetable Editor Modal */}
      <TimetableEditor
        isDark={isDark}
        timetable={timetable}
        setTimetable={setTimetable}
        open={showTimetableEditor}
        setOpen={setShowTimetableEditor}
      />
    </div>
  );
}
