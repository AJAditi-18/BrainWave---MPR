import React, { useState } from "react";
import {
  BookOpenIcon,
  DocumentTextIcon,
  BellIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for notes
  const [notes, setNotes] = useState([
    { id: 1, title: "Data Structures - Week 5", date: "2025-10-15", course: "CS201" },
  ]);
  const [noteForm, setNoteForm] = useState({ title: "", course: "" });

  // State for assignments
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Binary Tree Implementation", due: "2025-10-25", course: "CS201", submissions: 24 },
  ]);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", course: "", due: "", description: "" });

  // State for reminders
  const [reminders, setReminders] = useState([
    { id: 1, text: "Faculty meeting tomorrow at 10 AM", date: "2025-10-21" },
  ]);
  const [reminderForm, setReminderForm] = useState({ text: "", date: "" });

  // Mock student engagement data
  const students = [
    { name: "Alex Johnson", course: "CS201", attendance: "92%", assignments: "8/10", engagement: 85 },
    { name: "Sarah Williams", course: "CS301", attendance: "88%", assignments: "7/10", engagement: 70 },
  ];

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const addNote = (e) => {
    e.preventDefault();
    if (noteForm.title && noteForm.course) {
      setNotes([{ id: Date.now(), ...noteForm, date: new Date().toISOString().split("T")[0] }, ...notes]);
      setNoteForm({ title: "", course: "" });
    }
  };

  const addAssignment = (e) => {
    e.preventDefault();
    if (assignmentForm.title && assignmentForm.course && assignmentForm.due) {
      setAssignments([{ id: Date.now(), ...assignmentForm, submissions: 0 }, ...assignments]);
      setAssignmentForm({ title: "", course: "", due: "", description: "" });
    }
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (reminderForm.text && reminderForm.date) {
      setReminders([{ id: Date.now(), ...reminderForm }, ...reminders]);
      setReminderForm({ text: "", date: "" });
    }
  };

  // Navigation items
  const navItems = [
    { id: "overview", icon: <HomeIcon className="h-6 w-6" />, text: "Overview" },
    { id: "notes", icon: <BookOpenIcon className="h-6 w-6" />, text: "Notes" },
    { id: "assignments", icon: <DocumentTextIcon className="h-6 w-6" />, text: "Assignments" },
    { id: "reminders", icon: <BellIcon className="h-6 w-6" />, text: "Reminders" },
    { id: "students", icon: <UserGroupIcon className="h-6 w-6" />, text: "Students" },
    { id: "settings", icon: <Cog6ToothIcon className="h-6 w-6" />, text: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf7fa] to-[#e0f2fe] flex">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg w-64 p-6 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="font-black tracking-tight text-cyan-600 text-xl mb-6 flex items-center gap-2">
          🎓 BrainWave
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-cyan-100 font-medium ${
                activeTab === item.id ? "bg-cyan-50 text-cyan-900" : "text-gray-700"
              }`}
            >
              {item.icon}
              {item.text}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center font-bold text-cyan-700">
              {user?.fullName?.[0] || "T"}
            </div>
            <div>
              <div className="font-bold text-cyan-700">{user?.fullName || "Teacher"}</div>
              <div className="text-xs text-gray-400">Teacher</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6">
          {navItems.find((item) => item.id === activeTab)?.text}
        </h1>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <DocumentTextIcon className="h-8 w-8 text-cyan-500 mb-2" />
              <div className="text-2xl font-bold text-cyan-700">{assignments.length}</div>
              <div className="text-gray-500">Active Assignments</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <BookOpenIcon className="h-8 w-8 text-emerald-500 mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{notes.length}</div>
              <div className="text-gray-500">Notes Uploaded</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <UserGroupIcon className="h-8 w-8 text-pink-500 mb-2" />
              <div className="text-2xl font-bold text-pink-700">{students.length}</div>
              <div className="text-gray-500">Total Students</div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div>
            <form onSubmit={addNote} className="bg-white p-6 rounded-xl shadow mb-6">
              <h3 className="font-bold text-lg mb-4 text-cyan-700">Upload New Note</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={noteForm.course}
                  onChange={(e) => setNoteForm({ ...noteForm, course: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <button className="mt-4 bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
                Upload Note
              </button>
            </form>

            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold text-cyan-700">{note.title}</div>
                    <div className="text-sm text-gray-500">{note.course} • {note.date}</div>
                  </div>
                  <button 
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <form onSubmit={addAssignment} className="bg-white p-6 rounded-xl shadow mb-6">
              <h3 className="font-bold text-lg mb-4 text-cyan-700">Create New Assignment</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Assignment Title"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={assignmentForm.course}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, course: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <input
                type="date"
                value={assignmentForm.due}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, due: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <textarea
                placeholder="Description"
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg mb-4"
                rows="3"
              />
              <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
                Create Assignment
              </button>
            </form>

            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-cyan-700">{assignment.title}</div>
                    <span className="text-sm bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
                      {assignment.submissions} submissions
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {assignment.course} • Due: {assignment.due}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === "reminders" && (
          <div>
            <form onSubmit={addReminder} className="bg-white p-6 rounded-xl shadow mb-6">
              <h3 className="font-bold text-lg mb-4 text-cyan-700">Add Reminder</h3>
              <input
                type="text"
                placeholder="Reminder text"
                value={reminderForm.text}
                onChange={(e) => setReminderForm({ ...reminderForm, text: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <input
                type="date"
                value={reminderForm.date}
                onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
                Add Reminder
              </button>
            </form>

            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold text-cyan-700">{reminder.text}</div>
                    <div className="text-sm text-gray-500">{reminder.date}</div>
                  </div>
                  <button 
                    onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-4 text-cyan-700">Student Engagement Tracker</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Student</th>
                  <th className="text-left py-2">Course</th>
                  <th className="text-left py-2">Attendance</th>
                  <th className="text-left py-2">Assignments</th>
                  <th className="text-left py-2">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">{student.course}</td>
                    <td className="py-2">{student.attendance}</td>
                    <td className="py-2">{student.assignments}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${student.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm">{student.engagement}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-4 text-cyan-700">Settings</h3>
            <p className="text-gray-600">Settings options coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
