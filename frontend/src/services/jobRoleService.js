import api from './api';

export const jobRoleService = {
  // Get all job roles
  async getAllJobRoles() {
    const response = await api.get('/job-roles');
    return response.data;
  },

  // Get job role by ID
  async getJobRoleById(id) {
    const response = await api.get(`/job-roles/${id}`);
    return response.data;
  },

  // Get categories
  async getCategories() {
    const response = await api.get('/job-roles/categories');
    return response.data;
  },

  // Create job role
  async createJobRole(roleName, category) {
    const response = await api.post('/job-roles', {
      roleName,
      category,
    });
    return response.data;
  },
};
