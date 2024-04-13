const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { setupSocket } = require('./socketController');
setupSocket(httpServer);

const cors = require('cors');
const { startDB } = require('./utils/start-db');

const { isBusiness } = require('./middlewares/is-business-validator');

const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const businessRoutes = require('./routes/business-routes');
const userRoutes = require('./routes/user-routes');
const menuRoutes = require('./routes/menu-routes');
const tableRoutes = require('./routes/table-routes');
const orderRoutes = require('./routes/order-routes');
const qrMenuRoutes = require('./routes/qr-menu-routes');
const { verifyToken } = require('./middlewares/verify-token');
require('dotenv').config();

app.get('/health-status', (req, res) => {
  res.send('Hello World!');
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/user', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/qrmenu', qrMenuRoutes);

app.post('/api/generate-qrcode', verifyToken, isBusiness, (req, res) => {
  const businessUrl = req.body.businessUrl;
  const qrcode = require('qrcode');
  console.log(businessUrl);
  try {
    qrcode.toString(businessUrl, { type: 'svg' }, function (err, svg) {
      res.status(201).json({ svg: svg, message: 'Qrcode oluşturuldu', success: true });
    });
  } catch (error) {
    console.log(error);
    res.send(400).send({ message: 'Qrcode oluşturulamadı', success: false });
  }
});

httpServer.listen(process.env.PORT, () => {
  console.log('server runs at:', process.env.PORT);
  startDB();
});
