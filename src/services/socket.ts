import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const SOCKET_URL = API_URL.replace(/\/api$/, '');

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
