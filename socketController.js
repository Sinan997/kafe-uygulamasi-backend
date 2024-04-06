const socketIO = require('socket.io');

let io;

function setupSocket(server) {
  io = socketIO(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı.');

    socket.on('disconnect', () => {
      console.log('Kullanıcı ayrıldı.');
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
