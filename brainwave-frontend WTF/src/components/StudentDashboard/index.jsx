import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import DashboardPanel from './DashboardPanel';
import MyCoursesPanel from './MyCoursesPanel';
import AIAssistantPanel from './AIAssistantPanel';
import LibraryPanel from './LibraryPanel';
import CalendarPanel from './CalendarPanel';
import LeaderboardPanel from './LeaderboardPanel';
import AlumniConnectPanel from './AlumniConnectPanel';
import SettingsPanel from './SettingsPanel';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activePanel, setActivePanel] = useState('dashboard');

  const studentData = {
    roll_no: user.roll_no || user.Roll_no,
    name: user.name || user.Name,
    course: user.course || user.Course || 'N/A',
    shift: user.shift || user.Shift || 'N/A',
    section: user.section || user.Section || 'N/A',
    college_id: user.college_id || user.College_id,
    year: user.year || user.Year || 'N/A',
    email: user.email || user.Email,
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: '🏠' },
    { id: 'courses', label: 'Coursework', icon: '📚' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'library', label: 'Library', icon: '📖' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'alumni', label: 'Alumni Connect', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col border-r border-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-gray-700 dark:border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Brainwave
          </h1>
          <p className="text-sm text-gray-400 mt-1">Student Portal</p>
        </div>

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

        <div className="p-6 border-t border-gray-700 dark:border-gray-800">
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
        {activePanel === 'dashboard' && <DashboardPanel data={studentData} />}
        {activePanel === 'courses' && <MyCoursesPanel data={studentData} />}
        {activePanel === 'ai' && <AIAssistantPanel />}
        {activePanel === 'library' && <LibraryPanel data={studentData} />}
        {activePanel === 'calendar' && <CalendarPanel data={studentData} />}
        {activePanel === 'leaderboard' && <LeaderboardPanel data={studentData} />}
        {activePanel === 'alumni' && <AlumniConnectPanel />}
        {activePanel === 'settings' && <SettingsPanel data={studentData} />}
      </main>
    </div>
  );
};

export default StudentDashboard;
