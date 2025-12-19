import { candidateService } from '../services/candidateService.js';

export const candidateController = {
  /**
   * Create new candidate application
   */
  async createApplication(req, res, next) {
    try {
      const { fullName, email, phone, jobRoleId, jobRoleText } = req.body;
      const resumeFile = req.file;

      if (!resumeFile) {
        return res.status(400).json({
          success: false,
          error: 'Resume file is required',
        });
      }

      const candidateData = {
        fullName,
        email,
        phone,
        jobRoleId,
        jobRoleText,
      };

      const candidate = await candidateService.createCandidate(candidateData, resumeFile);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all candidates (Recruiter only)
   */
  async getAllCandidates(req, res, next) {
    try {
      const { status, jobRole, search } = req.query;

      const filters = {
        status,
        jobRole,
        search,
      };

      const candidates = await candidateService.getAllCandidates(filters);

      res.status(200).json({
        success: true,
        count: candidates.length,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get candidate by ID (Recruiter only)
   */
  async getCandidateById(req, res, next) {
    try {
      const { id } = req.params;

      const candidate = await candidateService.getCandidateById(id);

      res.status(200).json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update candidate status (Recruiter only)
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const candidate = await candidateService.updateCandidateStatus(
        id,
        status,
        req.recruiter.id,
        notes
      );

      res.status(200).json({
        success: true,
        message: 'Candidate status updated successfully',
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Semantic search for candidates (Recruiter only)
   */
  async semanticSearch(req, res, next) {
    try {
      const { query } = req.body;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      const results = await candidateService.semanticSearch(query, req.recruiter.id);

      res.status(200).json({
        success: true,
        query: query,
        count: results.length,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get candidate statistics (Recruiter only)
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await candidateService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
