import api from './api';

export const candidateService = {
  // Submit application (public)
  async submitApplication(formData) {
    const response = await api.post('/candidates/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all candidates
  async getAllCandidates(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.jobRole) params.append('jobRole', filters.jobRole);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/candidates?${params.toString()}`);
    return response.data;
  },

  // Get candidate by ID
  async getCandidateById(id) {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Update candidate status
  async updateStatus(id, status, notes = '') {
    const response = await api.put(`/candidates/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  // Semantic search
  async semanticSearch(query) {
    const response = await api.post('/candidates/search', { query });
    return response.data;
  },

  // Get statistics
  async getStatistics() {
    const response = await api.get('/candidates/statistics');
    return response.data;
  },
};
