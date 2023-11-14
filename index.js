const express = require('express');
const { startDB } = require('./utils/startDb');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const businessRoutes = require('./routes/businessRoutes');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/user', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/table', tableRoutes);

app.listen(8080, () => {
  console.log('server ayağa kalktı');
  startDB();
});
