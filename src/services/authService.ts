import api from './api';
import type { User } from '../types';

export const authService = {
  checkUsername: async (username: string): Promise<boolean> => {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data.available;
    } catch (error) {
      console.error('Error checking username:', error);
      // En caso de error (e.g. backend caído), retornamos false 
      // por seguridad para evitar colisiones, o podríamos lanzar el error.
      throw error; 
    }
  },

  register: async (userData: { name: string; lastName?: string; username: string; email: string; avatar?: string }): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
       console.error('Error fetching profile:', error);
       return null;
    }
  }
};
