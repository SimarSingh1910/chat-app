import { io } from 'socket.io-client';
import { API_URL } from './config';

// Lazily-created singleton socket. `withCredentials: true` makes the browser
// send the httpOnly `token` cookie in the WS handshake, which the server uses
// to authenticate the connection (see server/socket.js).
//
// `autoConnect: false` so we only connect once the user is authenticated —
// SocketContext calls socket.connect() / socket.disconnect() accordingly.
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(API_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
