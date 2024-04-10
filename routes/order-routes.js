const express = require('express');
const {
  getAllOrders,
  setOrderReady,
  setOrderDelivered,
} = require('../controllers/order-controllers');
const { verifyToken } = require('../middlewares/verify-token');
const { isWaiterOrBusiness } = require('../middlewares/is-business-or-waiter-validator');

const router = express.Router();

router.get('/all-orders', verifyToken, isWaiterOrBusiness, getAllOrders);

router.put('/set-ready/:orderId', verifyToken, isWaiterOrBusiness, setOrderReady);

router.put('/set-delivered/:orderId', verifyToken, isWaiterOrBusiness, setOrderDelivered);

module.exports = router;
