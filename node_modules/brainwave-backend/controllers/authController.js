const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

// Signup controller
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  
  console.log("Signup attempt:", email, name);
  
  // Validate MSI email domain
  if (!email.endsWith('@msijanakpuri.com')) {
    return res.status(400).json({ 
      message: 'Email must end with @msijanakpuri.com' 
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name
    };
    
    users.push(newUser);
    
    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log("Login attempt:", email);
  
  // Check if user exists
  const user = users.find(u => u.email === email);
  if (!user) {
    console.log("❌ User not found");
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  console.log("✅ User found:", user.email);
  
  try {
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
