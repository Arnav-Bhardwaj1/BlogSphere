const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters'),
  
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    .isLength({ max: 100 })
    .withMessage('Password must be less than 100 characters'),
    
  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

// Routes
router.post('/register', authLimiter, registerValidation, asyncHandler(register));
router.post('/login', authLimiter, loginValidation, asyncHandler(login));
router.post('/refresh-token', authLimiter, asyncHandler(refreshToken));
router.post('/forgot-password', authLimiter, forgotPasswordValidation, asyncHandler(forgotPassword));
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, asyncHandler(resetPassword));

// Protected routes
router.use(auth);

router.get('/me', asyncHandler(getMe));
router.put('/profile', updateProfileValidation, asyncHandler(updateProfile));
router.put('/change-password', changePasswordValidation, asyncHandler(changePassword));
router.post('/logout', asyncHandler(logout));

module.exports = router;
