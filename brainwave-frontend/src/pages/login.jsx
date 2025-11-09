import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authService } from "../services/authService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password, form.role);
      if (data.token) {
        if (data.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Invalid credentials. Please check your email/password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300">
      {/* 
        For solid white bg: replace above with bg-white 
        For solid black bg: replace with bg-black 
      */}
      <div className="bg-white shadow-xl rounded-lg px-8 py-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Login to Brainwave</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
            </button>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold bg-blue-700 text-white py-2 rounded-lg transition hover:bg-blue-900 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
