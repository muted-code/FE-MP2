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

export const updateRoom = async (id: string, name: string): Promise<Room> => {
  const response = await api.put(`/rooms/${id}`, { name });
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

// 👇 NUEVA FUNCIÓN: Obtener el historial de mensajes de la base de datos 👇
export const getRoomMessages = async (roomId: string): Promise<any[]> => {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
}; 

// 👇 AÑADE ESTO AL FINAL 👇
export const clearRoomMessages = async (roomId: string): Promise<void> => {
  await api.delete(`/rooms/${roomId}/messages`);
}; 