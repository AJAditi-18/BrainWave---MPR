/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);
        
        // Role-based redirect
        if (data.user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0c10] via-[#1a2332] to-[#0a0c10]">
      <div className="bg-[#0f1419] p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#67e8f9]/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#67e8f9] mb-2">Welcome Back</h2>
          <p className="text-[#9ca3af]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your.email@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#9ca3af]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#67e8f9] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
*/
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userToken, setUserToken] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Check if first login
        if (data.user.isFirstLogin) {
          setUserToken(data.token);
          setShowChangePassword(true);
        } else {
          if (data.user.role === "teacher") {
            navigate("/teacher-dashboard");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError("Connection error. Please try again.");
    }
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef7fa]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="font-bold text-2xl text-cyan-700 text-center mb-2">Sign In</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-500 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className="w-full px-4 py-2 rounded border bg-gray-50"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder={form.role === "student" ? "College ID or Email" : "Email"}
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded font-bold hover:bg-cyan-700 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-600 font-bold">
            Sign up
          </Link>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-gray-400">
            Default passwords: <b>student123</b> / <b>teacher123</b>
          </p>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal 
          token={userToken} 
          onClose={() => setShowChangePassword(false)}
          onSuccess={handlePasswordChanged}
        />
      )}
    </div>
  );
};

export default Login;
