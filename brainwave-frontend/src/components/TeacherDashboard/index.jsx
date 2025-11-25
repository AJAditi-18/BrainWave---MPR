import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import OverviewPanel from './OverviewPanel';
import AttendancePanel from './AttendancePanel';
import AssignmentsPanel from './AssignmentsPanel';
import NotesPanel from './NotesPanel';
import RemindersPanel from './RemindersPanel';
import CalendarPanel from './CalendarPanel';
import LeaderboardPanel from './LeaderboardPanel';
import AIAssistantPanel from './AIAssistantPanel';
import SettingsPanel from './SettingsPanel';
import brainwaveLogo from '../../assets/Logo Brainwave.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TeacherDashboard = () => {
  const { user, logout, token } = useAuth();
  const [activePanel, setActivePanel] = useState('overview');
  const [data, setData] = useState({
    teacher: null,
    timetable: [],
    stats: {},
    classes: [],
    attendance: [],
    assignments: [],
    notes: [],
    reminders: [],
    calendar: [],
    leaderboard: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');

  // ✅ FIX: Extract teacher data from user object with ALL possible field names
  const teacherData = {
    teacherid: user?.teacherid || user?.Teacher_id || user?.teacher_id || user?.id,
    name: user?.name || user?.Name,
    email: user?.email || user?.Email,
    department: user?.department || user?.Department || 'N/A',
    phone: user?.phone || user?.Phone || 'Not Provided'
  };

  // ✅ FIX: Ensure teacherId is never undefined
  const teacherId = teacherData.teacherid;

  console.log('🔍 User object:', user);
  console.log('🔍 Extracted teacherId:', teacherId);
  console.log('🔍 Teacher data:', teacherData);

  useEffect(() => {
    if (!teacherId) {
      console.error('❌ teacherId is undefined! User object:', user);
      return;
    }

    // Set teacher data from user object immediately
    setData(prev => ({
      ...prev,
      teacher: {
        Teacher_id: teacherData.teacherid,
        Name: teacherData.name,
        Email: teacherData.email,
        Department: teacherData.department,
        Phone: teacherData.phone
      }
    }));

    // Then fetch additional data
    fetchOverview();
  }, [teacherId]);

  const fetchOverview = async () => {
    if (!teacherId) {
      console.error('❌ Cannot fetch overview: teacherId is undefined');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📡 Fetching overview for teacherId:', teacherId);
      
      const response = await axios.get(`${API_URL}/api/teacher/overview/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Overview response:', response.data);
      
      setData(prev => ({
        ...prev,
        teacher: response.data.teacher || prev.teacher,
        timetable: response.data.timetable || [],
        stats: response.data.stats || {}
      }));
    } catch (error) {
      console.error('❌ Error fetching overview:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher/attendance/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, attendance: response.data }));
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAssignments = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher/assignments/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, assignments: response.data }));
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchNotes = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher/notes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, notes: response.data }));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchReminders = async () => {
    if (!teacherId) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/teacher/reminders/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, reminders: response.data }));
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchCalendar = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher/calendar/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, calendar: response.data }));
    } catch (error) {
      console.error('Error fetching calendar:', error);
    }
  };

  const fetchLeaderboard = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher/leaderboard/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => ({ ...prev, leaderboard: response.data }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'notes', label: 'Notes Library', icon: '📚' },
    { id: 'reminders', label: 'Reminders', icon: '⏰' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // ✅ Show error if teacherId is undefined
  if (!teacherId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Teacher ID not found in user session.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            User object: {JSON.stringify(user)}
          </p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Logout and Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col border-r border-gray-800 dark:border-gray-700">
        {/* Logo + App Name Header */}
        <div className="p-6 border-b border-gray-700 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img 
              src={brainwaveLogo} 
              alt="Brainwave" 
              className="w-10 h-10 rounded-lg object-cover shadow-md"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Brainwave
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">Teacher Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                activePanel === item.id
                  ? 'bg-teal-600 text-white border-l-4 border-teal-400'
                  : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-700 dark:border-gray-800">
          <div className="mb-4 p-3 bg-gray-800 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{teacherData.name}</p>
            <p className="text-xs text-gray-400 truncate">{teacherData.email}</p>
            <p className="text-xs text-blue-400 mt-1">ID: {teacherId}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {activePanel === 'overview' && <OverviewPanel data={data} token={token} teacherId={teacherId} fetchOverview={fetchOverview} />}
        {activePanel === 'attendance' && <AttendancePanel data={data} token={token} teacherId={teacherId} fetchAttendance={fetchAttendance} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />}
        {activePanel === 'assignments' && <AssignmentsPanel data={data} token={token} teacherId={teacherId} fetchAssignments={fetchAssignments} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />}
        {activePanel === 'notes' && <NotesPanel data={data} token={token} teacherId={teacherId} fetchNotes={fetchNotes} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />}
        {activePanel === 'reminders' && <RemindersPanel data={data} token={token} teacherId={teacherId} fetchReminders={fetchReminders} />}
        {activePanel === 'calendar' && <CalendarPanel data={data} token={token} teacherId={teacherId} fetchCalendar={fetchCalendar} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />}
        {activePanel === 'leaderboard' && <LeaderboardPanel data={data} token={token} fetchLeaderboard={fetchLeaderboard} selectedClass={selectedClass} setSelectedClass={setSelectedClass} />}
        {activePanel === 'ai' && <AIAssistantPanel token={token} teacherId={teacherId} />}
        {activePanel === 'settings' && <SettingsPanel data={data} token={token} teacherId={teacherId} fetchOverview={fetchOverview} />}
      </main>
    </div>
  );
};

export default TeacherDashboard;
