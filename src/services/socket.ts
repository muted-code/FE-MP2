import { io } from 'socket.io-client';

// 👇 Desvinculamos el socket de la API REST y forzamos el puerto 3002 👇
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3002';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
}); 