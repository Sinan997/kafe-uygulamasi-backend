const express = require('express');
const router = express.Router();
const {
  addTable,
  getAllTables,
  deleteTable,
  updateTable,
  addOrder,
  getTableOrders,
  takeOrders,
  deleteOrder,
} = require('../controllers/table-controllers');
const { verifyToken } = require('../middlewares/verify-token');
const { isBusiness } = require('../middlewares/is-business-validator');

router.post('/add-table', verifyToken, isBusiness, addTable);

router.get('/get-tables', verifyToken, isBusiness, getAllTables);

router.delete('/delete-table', verifyToken, isBusiness, deleteTable);

router.delete('/delete-order', verifyToken, isBusiness, deleteOrder);

router.put('/update-table', verifyToken, isBusiness, updateTable);

router.post('/add-order', verifyToken, isBusiness, addOrder);

router.post('/get-table-orders', verifyToken, isBusiness, getTableOrders);

router.post('/take-orders', verifyToken, isBusiness, takeOrders);
module.exports = router;
