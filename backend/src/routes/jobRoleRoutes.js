import express from 'express';
import { body } from 'express-validator';
import { jobRoleController } from '../controllers/jobRoleController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/v1/job-roles
 * @desc    Get all job roles
 * @access  Public
 */
router.get('/', jobRoleController.getAllJobRoles);

/**
 * @route   GET /api/v1/job-roles/categories
 * @desc    Get all job role categories
 * @access  Public
 */
router.get('/categories', jobRoleController.getCategories);

/**
 * @route   GET /api/v1/job-roles/:id
 * @desc    Get job role by ID
 * @access  Public
 */
router.get('/:id', jobRoleController.getJobRoleById);

/**
 * @route   POST /api/v1/job-roles
 * @desc    Create new job role
 * @access  Private (Recruiter)
 */
router.post(
  '/',
  authMiddleware,
  [
    body('roleName').notEmpty().withMessage('Role name is required'),
    body('category').optional(),
  ],
  validate,
  jobRoleController.createJobRole
);

export default router;
