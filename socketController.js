const socketIO = require('socket.io');

let io;

function setupSocket(server) {
  io = socketIO(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('new socket:', socket.id);

    socket.on('disconnect', () => {
      console.log('socket disconnected.', socket.id);
    });
  });
}

function getSocket() {
  if (!io) {
    throw new Error('Socket.IO henüz başlatılmadı!');
  }
  return io;
}

module.exports = { setupSocket, getSocket };
