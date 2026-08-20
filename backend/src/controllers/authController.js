const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register initial ADMIN or public setup
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, setupToken } = req.body;

    // Check setup token to prevent unauthorized admin creation
    if (!setupToken || setupToken !== process.env.ADMIN_SETUP_TOKEN) {
      return res.status(403).json({ message: 'Unauthorized: Invalid setup token' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default to ADMIN for this route, though we allow standard fallback logic
    const validRoles = ['ADMIN', 'TRAINER', 'STUDENT'];
    const assignedRole = validRoles.includes(role) ? role : 'ADMIN';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register TRAINER or STUDENT via admin portal
// @route   POST /api/auth/admin/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validRoles = ['TRAINER', 'STUDENT'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role must be TRAINER or STUDENT' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email and pull in the password (since select: false)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      created_at: req.user.created_at
    };
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password for logged in user
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect old password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student details (Admin/Trainer only)
// @route   PUT /api/auth/student/:id
// @access  Private/AdminOrTrainer
const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'STUDENT') {
      return res.status(400).json({ message: 'Can only update students' });
    }

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    
    if (req.body.password) {
      student.password = req.body.password;
    }

    const updatedStudent = await student.save();

    res.json({
      _id: updatedStudent.id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      role: updatedStudent.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/auth/students
// @access  Private/AdminOrTrainer
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' }).select('-password');
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/auth/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrainers = await User.countDocuments({ role: 'TRAINER' });
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    
    res.status(200).json({
      totalUsers,
      totalTrainers,
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  registerUser,
  loginUser,
  getMe,
  changePassword,
  updateStudent,
  getStudents,
  getUserStats,
};
