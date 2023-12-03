const express = require('express');
const { startDB } = require('./utils/startDb');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/category', categoryRoutes);
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

app.listen(8080, () => {
  console.log('server ayağa kalktı');
  startDB();
});
