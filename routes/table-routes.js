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
const { isWaiterOrBusiness } = require('../middlewares/is-business-or-waiter-validator');

router.post('/add-table', verifyToken, isWaiterOrBusiness, addTable);

router.get('/get-tables', verifyToken, isWaiterOrBusiness, getAllTables);

router.delete('/delete-table', verifyToken, isWaiterOrBusiness, deleteTable);

router.delete('/delete-order', verifyToken, isWaiterOrBusiness, deleteOrder);

router.put('/update-table', verifyToken, isWaiterOrBusiness, updateTable);

router.post('/add-order', verifyToken, isWaiterOrBusiness, addOrder);

router.post('/get-table-orders', verifyToken, isWaiterOrBusiness, getTableOrders);

router.post('/take-orders', verifyToken, isWaiterOrBusiness, takeOrders);
module.exports = router;
