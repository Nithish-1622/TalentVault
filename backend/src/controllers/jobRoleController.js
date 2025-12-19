import { jobRoleService } from '../services/jobRoleService.js';

export const jobRoleController = {
  /**
   * Get all job roles
   */
  async getAllJobRoles(req, res, next) {
    try {
      const jobRoles = await jobRoleService.getAllJobRoles();

      res.status(200).json({
        success: true,
        count: jobRoles.length,
        data: jobRoles,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get job role by ID
   */
  async getJobRoleById(req, res, next) {
    try {
      const { id } = req.params;

      const jobRole = await jobRoleService.getJobRoleById(id);

      res.status(200).json({
        success: true,
        data: jobRole,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new job role (Recruiter only)
   */
  async createJobRole(req, res, next) {
    try {
      const { roleName, category } = req.body;

      const jobRole = await jobRoleService.createJobRole(roleName, category);

      res.status(201).json({
        success: true,
        message: 'Job role created successfully',
        data: jobRole,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get job role categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await jobRoleService.getCategories();

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },
};
