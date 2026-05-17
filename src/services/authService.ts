import api from './api';
import type { User } from '../types';

export const authService = {
  checkUsername: async (username: string): Promise<boolean> => {
    try {
      // Retorna true si está disponible, false si ya existe
      const response = await api.get(`/api/auth/check-username/${username}`);
      return response.data.available;
    } catch (error) {
      console.error('Error checking username:', error);
      return false; 
    }
  },

  register: async (userData: { name: string; username: string; email: string }): Promise<User> => {
    // El token de Firebase se envía automáticamente por el interceptor de api.ts
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  // Opcionalmente podemos tener un getProfile para cargar los datos completos
  getProfile: async (): Promise<User | null> => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
       console.error('Error fetching profile:', error);
       return null;
    }
  }
};
