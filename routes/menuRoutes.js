const express = require('express');
const router = express.Router();
const {
  addCategory,
  allCategories,
  deleteCategory,
  setCategoriesIndex,
  getCategory,
  addProduct,
  getAllProducts,
  setProductsIndex,
  changeCategoryName,
  deleteProduct,
  updateProductAsync
} = require('../controllers/menuController');
const { isBusiness } = require('../middlewares/isBusinessValidator');
const { verifyToken } = require('../middlewares/verifyToken');

// TODO: add isOwner middleware

router.get('/all-categories', verifyToken, isBusiness, allCategories);

router.post('/add-category', verifyToken, isBusiness, addCategory);

router.delete('/delete-category', verifyToken, isBusiness, deleteCategory);

router.post('/set-categories-index', verifyToken, isBusiness, setCategoriesIndex);

router.get('/get-category/:categoryId', verifyToken, isBusiness, getCategory);

router.get('/all-products/:categoryId', verifyToken, isBusiness, getAllProducts);

router.post('/add-product', verifyToken, isBusiness, addProduct);

router.post('/set-products-index', verifyToken, isBusiness, setProductsIndex);

router.post('/change-category-name', verifyToken, isBusiness, changeCategoryName);

router.delete('/delete-product', verifyToken, isBusiness, deleteProduct);

router.post('/update-product', verifyToken, isBusiness, updateProductAsync);

module.exports = router;
