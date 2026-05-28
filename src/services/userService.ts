import api from './api';
import type { User } from '../types';

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const deleteProfile = async (): Promise<void> => {
  await api.delete('/users/profile');
};
