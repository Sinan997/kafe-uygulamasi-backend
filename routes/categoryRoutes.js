const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  getCategory,
  changeCategoryName,
  deleteProduct,
  setProductsIndex,
  updateProductAsync,
} = require('../controllers/categoryController');
const { isBusiness } = require('../middlewares/isBusinessValidator');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/get-category/:categoryId', verifyToken, isBusiness, getCategory);
router.get('/all-products/:categoryId', verifyToken, isBusiness, getAllProducts);
router.post('/add-product', verifyToken, isBusiness, addProduct);
router.post('/change-category-name', verifyToken, isBusiness, changeCategoryName);
router.delete('/delete-product', verifyToken, isBusiness, deleteProduct);
router.post('/set-products-index', verifyToken, isBusiness, setProductsIndex);
router.post('/update-product', verifyToken, isBusiness, updateProductAsync);

module.exports = router;
