import api from './api';
import type { Room } from '../types';

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms');
  return response.data;
};

export const createRoom = async (name: string): Promise<Room> => {
  const response = await api.post('/rooms', { name });
  return response.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};
