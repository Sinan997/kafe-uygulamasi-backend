const express = require('express');
const router = express.Router();
const { getAllOrders, getAllCategories } = require('../controllers/business-controller');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/get-all-orders', verifyToken, getAllOrders);

router.get('/get-all-categories', verifyToken, getAllCategories);

module.exports = router;
