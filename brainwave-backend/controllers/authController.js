const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IN-MEMORY STORAGE (temporary - lost on restart)
let users = [];

// Pre-seed demo accounts on server start
(async () => {
  const studentHash = await bcrypt.hash('student123', 12);
  const teacherHash = await bcrypt.hash('teacher123', 12);
  
  users = [
    {
      id: 1,
      fullName: 'Demo Student',
      email: 'student@test.com',
      password: studentHash,
      role: 'student',
      isFirstLogin: false
    },
    {
      id: 2,
      fullName: 'Demo Teacher',
      email: 'teacher@test.com',
      password: teacherHash,
      role: 'teacher',
      isFirstLogin: false
    }
  ];
  
  console.log('✅ Demo accounts created');
})();

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      isFirstLogin: user.isFirstLogin 
    },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '7d' }
  );
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: users.length + 1,
      fullName,
      email,
      password: hashedPassword,
      role: role || 'student',
      isFirstLogin: false
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    console.log('✅ New user created:', email);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isFirstLogin: false
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    console.log('🔍 Login attempt:', { identifier, role });

    // Find user by email/identifier
    const user = users.find(u => u.email === identifier && u.role === role);

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password correct');

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.isFirstLogin = false;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DEBUG: View all users (remove in production!)
exports.getAllUsers = (req, res) => {
  res.json({ 
    users: users.map(u => ({ id: u.id, email: u.email, role: u.role })),
    total: users.length 
  });
};
