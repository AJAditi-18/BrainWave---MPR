import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
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
    login({ name: 'Student', email: form.email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brainwave-bg">
      <div className="w-full max-w-md bg-brainwave-primary-glass p-8 rounded-xl shadow-brainwave flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-2">Welcome to Brainwave</h2>
        <p className="text-sm text-center mb-6">Sign in to your account</p>
        <form className="w-full space-y-6" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full mt-2 bg-brainwave-secondary text-brainwave-primary font-semibold hover:bg-brainwave-primary hover:text-brainwave-secondary transition"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
