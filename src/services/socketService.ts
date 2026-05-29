import { io, Socket } from 'socket.io-client';
import { auth } from '../firebase/firebaseConfig';

let socket: Socket | null = null;

export const connectSocket = async () => {
  if (socket?.connected) return socket;

  // 👇 CAMBIAMOS LA URL PARA QUE APUNTE AL NUEVO SERVIDOR EN TIEMPO REAL (PUERTO 3002) 👇
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3002';

  // We can attach the auth token if needed
  const token = await auth.currentUser?.getIdToken();

  socket = io(url, {
    auth: {
      token
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Conectado al servidor de WebSockets (RT):', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Desconectado de WebSockets (RT)');
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
