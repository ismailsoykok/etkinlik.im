import api from './axios';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/login', { username, password });
    const token = response.data.token || response.data;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    }

    return response.data;
  },

  register: async (username, password) => {
    const response = await api.post('/api/register', {
      username,
      password,
      role: { name: 'ROLE_USER' },
    });

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    return localStorage.getItem('username');
  },
};
