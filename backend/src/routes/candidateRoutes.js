import express from 'express';
import { body } from 'express-validator';
import { candidateController } from '../controllers/candidateController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/candidates/apply
 * @desc    Submit job application (Public - for applicants)
 * @access  Public
 */
router.post(
  '/apply',
  upload.single('resume'),
  handleUploadError,
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('jobRoleText').notEmpty().withMessage('Job role is required'),
    body('jobRoleId').optional(),
  ],
  validate,
  candidateController.createApplication
);

/**
 * @route   GET /api/v1/candidates
 * @desc    Get all candidates with filters
 * @access  Private (Recruiter)
 */
router.get('/', authMiddleware, candidateController.getAllCandidates);

/**
 * @route   GET /api/v1/candidates/statistics
 * @desc    Get candidate statistics
 * @access  Private (Recruiter)
 */
router.get('/statistics', authMiddleware, candidateController.getStatistics);

/**
 * @route   GET /api/v1/candidates/:id
 * @desc    Get candidate by ID
 * @access  Private (Recruiter)
 */
router.get('/:id', authMiddleware, candidateController.getCandidateById);

/**
 * @route   PUT /api/v1/candidates/:id/status
 * @desc    Update candidate status
 * @access  Private (Recruiter)
 */
router.put(
  '/:id/status',
  authMiddleware,
  [
    body('status')
      .isIn(['Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'])
      .withMessage('Invalid status value'),
    body('notes').optional(),
  ],
  validate,
  candidateController.updateStatus
);

/**
 * @route   POST /api/v1/candidates/search
 * @desc    Semantic search for candidates
 * @access  Private (Recruiter)
 */
router.post(
  '/search',
  authMiddleware,
  [body('query').notEmpty().withMessage('Search query is required')],
  validate,
  candidateController.semanticSearch
);

export default router;
