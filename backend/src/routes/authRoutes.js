import express from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new recruiter
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('companyName').optional(),
  ],
  validate,
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login recruiter
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get recruiter profile
 * @access  Private (Recruiter)
 */
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
