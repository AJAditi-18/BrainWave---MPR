/*import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => email.endsWith("@msijanakpuri.com");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(formData.email)) {
      setError("MSI Email only");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Could not connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef7fa]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="font-bold text-2xl text-cyan-700 text-center mb-2">Create your account</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-500 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="MSI Email"
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded border bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-2 text-cyan-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2 rounded font-bold hover:bg-cyan-700 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-600 font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
*/
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    rollNo: "",
    collegeId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
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
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef7fa]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="font-bold text-2xl text-cyan-700 text-center mb-2">Create Account</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-500 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded border bg-gray-50"
            required
          />
          
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className="w-full px-4 py-2 rounded border bg-gray-50"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {form.role === "student" && (
            <>
              <input
                type="text"
                name="rollNo"
                value={form.rollNo}
                onChange={handleChange}
                placeholder="Roll Number"
                className="w-full px-4 py-2 rounded border bg-gray-50"
                required
              />
              <input
                type="text"
                name="collegeId"
                value={form.collegeId}
                onChange={handleChange}
                placeholder="College ID (e.g., ST2023001)"
                className="w-full px-4 py-2 rounded border bg-gray-50"
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-600 font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
