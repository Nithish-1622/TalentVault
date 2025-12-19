import axios from 'axios';
import { config } from '../config/index.js';

const aiServiceClient = axios.create({
  baseURL: config.aiService.url,
  timeout: config.aiService.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiService = {
  /**
   * Parse resume and extract information
   */
  async parseResume(resumeUrl, filename) {
    try {
      const response = await aiServiceClient.post('/parse-resume', {
        resume_url: resumeUrl,
        filename: filename,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Parse Resume Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to parse resume');
    }
  },

  /**
   * Generate embeddings for resume text
   */
  async generateEmbeddings(text) {
    try {
      const response = await aiServiceClient.post('/generate-embeddings', {
        text: text,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Generate Embeddings Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to generate embeddings');
    }
  },

  /**
   * Perform semantic search
   */
  async semanticSearch(query, candidateIds = []) {
    try {
      const response = await aiServiceClient.post('/semantic-search', {
        query: query,
        candidate_ids: candidateIds,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Semantic Search Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to perform semantic search');
    }
  },

  /**
   * Generate candidate summary
   */
  async generateSummary(resumeText, skills, experience) {
    try {
      const response = await aiServiceClient.post('/generate-summary', {
        resume_text: resumeText,
        skills: skills,
        experience: experience,
      });
      return response.data;
    } catch (error) {
      console.error('AI Service - Generate Summary Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to generate summary');
    }
  },

  /**
   * Health check for AI service
   */
  async healthCheck() {
    try {
      const response = await aiServiceClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('AI Service - Health Check Error:', error.message);
      return { status: 'unavailable' };
    }
  },
};
