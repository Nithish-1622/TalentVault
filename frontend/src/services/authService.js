import api from './api';

export const authService = {
  // Register new recruiter
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('recruiter', JSON.stringify(response.data.data.recruiter));
    }
    return response.data;
  },

  // Login recruiter
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('recruiter', JSON.stringify(response.data.data.recruiter));
    }
    return response.data;
  },

  // Get profile
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('recruiter');
  },

  // Check if logged in
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get current recruiter
  getCurrentRecruiter() {
    const recruiter = localStorage.getItem('recruiter');
    return recruiter ? JSON.parse(recruiter) : null;
  },
};
