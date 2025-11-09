import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected route wrapper
const PrivateRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  console.log("PrivateRoute - user:", user); // Debug log
  console.log("PrivateRoute - allowedRole:", allowedRole); // Debug log

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    console.log(`Role mismatch: user role is ${user.role}, required role is ${allowedRole}`);
    return <Navigate to="/login" />;
  }

  console.log("Access granted!");
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRole="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Teacher Dashboard Route */}
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute allowedRole="teacher">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
