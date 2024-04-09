const express = require('express');
const router = express.Router();
const { getAllOrders, getAllCategories } = require('../controllers/business-controllers');
const { verifyToken } = require('../middlewares/verify-token');

router.get('/get-all-orders', verifyToken, getAllOrders);

router.get('/get-all-categories', verifyToken, getAllCategories);

module.exports = router;
