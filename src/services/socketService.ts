import { io, Socket } from 'socket.io-client';
import { auth } from '../firebase/firebaseConfig';

let socket: Socket | null = null;

export const connectSocket = async () => {
  if (socket?.connected) return socket;

  const url = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:3001';

  // We can attach the auth token if needed
  const token = await auth.currentUser?.getIdToken();

  socket = io(url, {
    auth: {
      token
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Conectado al servidor de WebSockets:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Desconectado de WebSockets');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
