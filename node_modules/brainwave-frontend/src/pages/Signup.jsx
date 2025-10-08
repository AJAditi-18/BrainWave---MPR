import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    return email.endsWith('@msijanakpuri.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!validateEmail(form.email)) {
      newErrors.email = 'Email must end with @msijanakpuri.com';
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
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        login({ name: data.user.name, email: data.user.email });
        navigate('/dashboard');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brainwave-bg">
      <div className="w-full max-w-md bg-brainwave-primary-glass p-8 rounded-xl shadow-brainwave flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-2">Welcome to Brainwave</h2>
        <p className="text-sm text-center mb-6">Create your account</p>
        
        <form className="w-full space-y-6" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Input
              label="MSI Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="yourname@msijanakpuri.com"
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
            disabled={loading}
            className="w-full mt-2 bg-brainwave-secondary text-brainwave-primary font-semibold hover:bg-brainwave-primary hover:text-brainwave-secondary transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-brainwave-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-brainwave-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
