const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  registerUser,
  loginUser,
  getMe,
  changePassword,
  updateStudent,
  getStudents,
  getUserStats,
} = require('../controllers/authController');
const { protect, admin, adminOrTrainer } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// Admin-only route to register Trainer or Student
router.post('/admin/register', protect, admin, registerUser);

// Admin or Trainer route to update Student
router.put('/student/:id', protect, adminOrTrainer, updateStudent);

// Admin or Trainer route to get all Students
router.get('/students', protect, adminOrTrainer, getStudents);

// Admin-only route to get user stats
router.get('/users/stats', protect, admin, getUserStats);

module.exports = router;
