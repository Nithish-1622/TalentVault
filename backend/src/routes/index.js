import express from 'express';
import authRoutes from './authRoutes.js';
import candidateRoutes from './candidateRoutes.js';
import jobRoleRoutes from './jobRoleRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TalentVault API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/job-roles', jobRoleRoutes);

export default router;
