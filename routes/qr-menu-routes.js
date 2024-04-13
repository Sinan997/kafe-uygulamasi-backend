const express = require('express');
const { getAllCategoriesAndProducts } = require('../controllers/qr-menu-controllers');

const router = express.Router();

router.get('/get-categories-products/:businessName', getAllCategoriesAndProducts);

module.exports = router;
