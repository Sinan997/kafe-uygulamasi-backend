const express = require('express');
const router = express.Router();
const { getAllOrders, getAllCategories } = require('../controllers/business-controllers');
const { verifyToken } = require('../middlewares/verify-token');
const { isBusiness } = require('../middlewares/is-business-validator');

router.get('/get-all-orders', verifyToken, isBusiness, getAllOrders);

router.get('/get-all-categories', verifyToken, isBusiness, getAllCategories);

module.exports = router;
