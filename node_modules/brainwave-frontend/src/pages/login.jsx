import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

        if (data.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot connect to server. Make sure backend is running!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef7fa]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="font-bold text-2xl text-cyan-700 text-center mb-2">Sign In</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className="w-full px-4 py-2 rounded border bg-white text-gray-900 border-gray-300"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded border bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            required
          />

          {/* PASSWORD WITH SHOW/HIDE */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded border bg-white text-gray-900 border-gray-300 placeholder-gray-500 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded font-bold hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-600 font-bold">
            Sign up
          </Link>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-700">
          <strong>Demo Accounts:</strong><br/>
          Student: student@test.com / student123<br/>
          Teacher: teacher@test.com / teacher123
        </div>
      </div>
    </div>
  );
};

export default Login;
