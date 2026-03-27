import { Server } from 'socket.io';
import logger from './logger';

let io;

export function initSocketIO (server) {
  io = new Server(server, {
    transports: ['websocket'],
    cors: { origin: '*' },
  });

  io.on('connection', socket => {
    logger.info(`Socket.io client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`Socket.io client disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.io initialized');
  return io;
}

export function emitExcluding (event, data, excludeSocketIds) {
  if (!io) return;
  io.sockets.sockets.forEach(socket => {
    if (!excludeSocketIds.has(socket.id)) {
      socket.emit(event, data);
    }
  });
}
