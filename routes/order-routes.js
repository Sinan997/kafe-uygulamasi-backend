const express = require('express');
const {
  getAllOrders,
  setOrderReady,
  setOrderDelivered,
} = require('../controllers/order-controllers');
const { verifyToken } = require('../middlewares/verify-token');

const router = express.Router();

router.get('/all-orders', verifyToken, getAllOrders);

router.put('/set-ready/:orderId', verifyToken, setOrderReady);

router.put('/set-delivered/:orderId', verifyToken, setOrderDelivered);

module.exports = router;
