import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // TEMP: Demo credentials (hardcoded for testing)
  const DEMO_USERS = {
    student: { email: "student@test.com", password: "password123", role: "student", name: "Demo Student" },
    teacher: { email: "teacher@test.com", password: "password123", role: "teacher", name: "Demo Teacher" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);

      // Check credentials against demo users
      const demoUser = form.role === "student" ? DEMO_USERS.student : DEMO_USERS.teacher;

      if (form.identifier === demoUser.email && form.password === demoUser.password) {
        // Login successful
        const userData = {
          id: "demo-" + form.role,
          fullName: demoUser.name,
          email: demoUser.email,
          role: form.role,
        };

        console.log("Login successful, user data:", userData);

        // Store token and user data
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));

        // Update auth context
        login(userData);

        // Navigate based on role
        console.log("Navigating to:", form.role === "teacher" ? "/teacher-dashboard" : "/dashboard");
        
        if (form.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid credentials. Use the demo credentials shown below.");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Brainwave</h1>
          <p className="text-gray-600 text-sm mt-1">Educational Platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Login As
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-bold text-blue-900 mb-2">✅ DEMO CREDENTIALS (Temp):</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Student:</strong></p>
            <p className="ml-2">📧 student@test.com</p>
            <p className="ml-2">🔑 password123</p>
            <p className="mt-2"><strong>Teacher:</strong></p>
            <p className="ml-2">📧 teacher@test.com</p>
            <p className="ml-2">🔑 password123</p>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>⚠️ This is a temporary solution. Replace with real backend later.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
