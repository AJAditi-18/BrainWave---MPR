import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/login';
import Signup from './components/Signup';
import TeacherDashboard from './components/TeacherDashboard/index';
import StudentDashboard from './components/StudentDashboard/index';

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (user.role === 'student') {
    return <StudentDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Unknown Role</h1>
        <p className="text-gray-600 mt-2">Please contact support</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
