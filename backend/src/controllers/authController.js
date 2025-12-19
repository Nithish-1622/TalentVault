import { authService } from '../services/authService.js';

export const authController = {
  /**
   * Register new recruiter
   */
  async register(req, res, next) {
    try {
      const { email, password, fullName, companyName } = req.body;

      const result = await authService.register(email, password, fullName, companyName);

      res.status(201).json({
        success: true,
        message: 'Recruiter registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login recruiter
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get recruiter profile
   */
  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.recruiter.id);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },
};
