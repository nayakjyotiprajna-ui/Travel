import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.origin.includes('5173') ? 'http://localhost:5000' : window.location.origin);
    socket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected successfully with ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.warn('[Socket.IO] Connection error:', error.message);
    });
  }

  return socket;
};
