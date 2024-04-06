const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer, {
//   cors: { origin: '*' },
// });
const { setupSocket } = require('./socketController');
setupSocket(httpServer);

const cors = require('cors');
const { startDB } = require('./utils/startDb');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/order-routes');
require('dotenv').config();

app.get('/health-status', (req, res) => {
  res.send('Hello World!');
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/order', orderRoutes);

// qrcode
app.post('/api/generate-qrcode', (req, res) => {
  const businessUrl = req.body.businessUrl;
  const qrcode = require('qrcode');
  try {
    qrcode.toString(businessUrl, { type: 'svg' }, function (err, svg) {
      res.status(201).json({ svg: svg, message: 'Qrcode oluşturuldu', success: true });
    });
  } catch (error) {
    console.log(error);
    res.send(400).send({ message: 'Qrcode oluşturulamadı', success: false });
  }
});

// io.on('connection', (socket) => {
//   console.log(socket.client.conn.id);
//   console.log('a user connected');

//   socket.emit('6606c2a072ecef8c5837b3dc', 'Hello from server');

//   // socket.on('message', (message) => {
//   //   console.log(message);
//   //   io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
//   // });

//   // socket.on('disconnect', () => {
//   //   console.log('a user disconnected!');
//   // });
// });

httpServer.listen(process.env.PORT, () => {
  console.log('server runs at:', process.env.PORT);
  startDB();
});
