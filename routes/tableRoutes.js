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
} = require('../controllers/table-controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { isBusiness } = require('../middlewares/isBusinessValidator');

router.post('/add-table', verifyToken, isBusiness, addTable);

router.get('/get-tables', verifyToken, isBusiness, getAllTables);

router.delete('/delete-table', verifyToken, isBusiness, deleteTable);

router.delete('/delete-order', verifyToken, isBusiness, deleteOrder);

router.put('/update-table', verifyToken, isBusiness, updateTable);

router.post('/add-order', verifyToken, isBusiness, addOrder);

router.post('/get-table-orders', verifyToken, isBusiness, getTableOrders);

router.post('/take-orders', verifyToken, isBusiness, takeOrders);
module.exports = router;
