const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['host', 'renter']).withMessage('Role must be either host or renter')
];

// @route   POST /api/auth/register
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/logout
router.post('/logout', authMiddleware, logout);

// @route   GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
