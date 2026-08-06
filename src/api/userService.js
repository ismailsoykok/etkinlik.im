import api from './axios';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data; // Should be empty/204 No Content
  }
};
