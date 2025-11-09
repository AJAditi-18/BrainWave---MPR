import React, { useState, useMemo } from "react";
import OverviewPanel from "./Panels/OverviewPanel";
import AttendancePanel from "./Panels/AttendancePanel";
import AssignmentsPanel from "./Panels/AssignmentsPanel";
import NotesPanel from "./Panels/NotesPanel";
import RemindersPanel from "./Panels/RemindersPanel";
import SettingsPanel from "./Panels/SettingsPanel";
import StudentsPanel from "./Panels/StudentsPanel";
import AssistantPanel from "./Panels/AssistantPanel";
import {
  BookOpenIcon,
  DocumentTextIcon,
  BellIcon,
  UserGroupIcon,
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  SunIcon,
  MoonIcon,
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

const timetable = [
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
];

const classSubjectOptions = classMap.map((cls) => ({
  classKey: cls.classKey,
  label: `${cls.className} - ${cls.subject}`,
  students: cls.students,
}));

export default function TeacherDashboard() {
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(false);
  const [selectedClassKey, setSelectedClassKey] = useState(classMap[0].classKey);
  const [attendance, setAttendance] = useState({});
  const [noClassDates, setNoClassDates] = useState({});
  const [assignmentsByClass, setAssignmentsByClass] = useState({});
  const [assignmentFormClass, setAssignmentFormClass] = useState(classSubjectOptions[0].classKey);
  const [newAssignment, setNewAssignment] = useState({ name: "", due: "" });
  const [notesByClass, setNotesByClass] = useState({});
  const [notesFormClass, setNotesFormClass] = useState(classSubjectOptions[0].classKey);
  const [newNote, setNewNote] = useState({ title: "" });
  const [reminders, setReminders] = useState([
    { id: 1, title: "Faculty meeting tomorrow at 10 AM", date: "2025-11-08" },
  ]);
  const [newReminder, setNewReminder] = useState({ title: "", date: "" });
  const [editingReminder, setEditingReminder] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ ...teacherProfile });
  const [studentAssignments, setStudentAssignments] = useState({});
  const [studentMarks, setStudentMarks] = useState({});

  // Calculated values
  const totalAssignments = useMemo(
    () => Object.values(assignmentsByClass).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0),
    [assignmentsByClass]
  );
  const totalNotes = useMemo(
    () => Object.values(notesByClass).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0),
    [notesByClass]
  );
  const totalStudents = useMemo(() => classMap.reduce((sum, cls) => sum + cls.students.length, 0), []);

  const navItems = [
    { id: "overview", icon: HomeIcon, label: "Overview" },
    { id: "attendance", icon: CalendarIcon, label: "Attendance" },
    { id: "assignments", icon: ClipboardDocumentCheckIcon, label: "Assignments" },
    { id: "notes", icon: BookOpenIcon, label: "Notes" },
    { id: "reminders", icon: BellIcon, label: "Reminders" },
    { id: "students", icon: UserGroupIcon, label: "Students" },
    { id: "assistant", icon: ChatBubbleLeftRightIcon, label: "Assistant" },
    { id: "settings", icon: Cog6ToothIcon, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPanel
            isDark={isDark}
            teacherProfile={teacherProfile}
            timetable={timetable}
            totalAssignments={totalAssignments}
            totalNotes={totalNotes}
            totalStudents={totalStudents}
          />
        );
      case "attendance":
        return (
          <AttendancePanel
            isDark={isDark}
            classMap={classMap}
            selectedClassKey={selectedClassKey}
            setSelectedClassKey={setSelectedClassKey}
            attendance={attendance}
            setAttendance={setAttendance}
            noClassDates={noClassDates}
            setNoClassDates={setNoClassDates}
            attendanceDates={attendanceDates}
          />
        );
      case "assignments":
        return (
          <AssignmentsPanel
            isDark={isDark}
            classSubjectOptions={classSubjectOptions}
            assignmentFormClass={assignmentFormClass}
            setAssignmentFormClass={setAssignmentFormClass}
            newAssignment={newAssignment}
            setNewAssignment={setNewAssignment}
            assignmentsByClass={assignmentsByClass}
            setAssignmentsByClass={setAssignmentsByClass}
          />
        );
      case "notes":
        return (
          <NotesPanel
            isDark={isDark}
            classSubjectOptions={classSubjectOptions}
            notesFormClass={notesFormClass}
            setNotesFormClass={setNotesFormClass}
            newNote={newNote}
            setNewNote={setNewNote}
            notesByClass={notesByClass}
            setNotesByClass={setNotesByClass}
          />
        );
      case "reminders":
        return (
          <RemindersPanel
            isDark={isDark}
            reminders={reminders}
            setReminders={setReminders}
            newReminder={newReminder}
            setNewReminder={setNewReminder}
            editingReminder={editingReminder}
            setEditingReminder={setEditingReminder}
            editDraft={editDraft}
            setEditDraft={setEditDraft}
          />
        );
case "students":
  return (
    <StudentsPanel
      isDark={isDark}
      classMap={classMap}
      assignmentsByClass={assignmentsByClass}
      studentAssignments={studentAssignments}
      setStudentAssignments={setStudentAssignments}
      studentMarks={studentMarks}
      setStudentMarks={setStudentMarks}
      attendance={attendance}
      attendanceDates={attendanceDates}
    />
  );


      case "assistant":
        return <AssistantPanel isDark={isDark} />;
      case "settings":
        return (
          <SettingsPanel
            isDark={isDark}
            teacherProfile={teacherProfile}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            profileDraft={profileDraft}
            setProfileDraft={setProfileDraft}
          />
        );
      default:
        return (
          <OverviewPanel
            isDark={isDark}
            teacherProfile={teacherProfile}
            timetable={timetable}
            totalAssignments={totalAssignments}
            totalNotes={totalNotes}
            totalStudents={totalStudents}
          />
        );
    }
  };

  return (
    <div className={`flex h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <aside className={`w-64 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Brainwave</h1>
          <p className="text-sm text-gray-500">Teacher Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Dark Mode Toggle & Logout */}
        <div className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"} flex items-center justify-center gap-3`}>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition ${
              isDark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{renderPanel()}</main>
    </div>
  );
}
