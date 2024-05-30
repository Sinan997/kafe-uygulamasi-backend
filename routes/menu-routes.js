const express = require('express');
const router = express.Router();
const {
  addCategory,
  allCategories,
  deleteCategory,
  setCategoriesIndex,
  addProduct,
  getAllProducts,
  setProductsIndex,
  changeCategoryName,
  deleteProduct,
  updateProductAsync,
} = require('../controllers/menu-controllers');
const { isBusiness } = require('../middlewares/is-business-validator');
const { isWaiterOrBusiness } = require('../middlewares/is-business-or-waiter-validator');
const { verifyToken } = require('../middlewares/verify-token');

// TODO: add isOwner middleware

router.get('/all-categories', verifyToken, isWaiterOrBusiness, allCategories);

router.post('/add-category', verifyToken, isBusiness, addCategory);

router.delete('/delete-category', verifyToken, isBusiness, deleteCategory);

router.post('/set-categories-index', verifyToken, isBusiness, setCategoriesIndex);

router.get('/all-products/:categoryId', verifyToken, isBusiness, getAllProducts);

router.post('/add-product', verifyToken, isBusiness, addProduct);

router.post('/set-products-index', verifyToken, isBusiness, setProductsIndex);

router.post('/change-category-name', verifyToken, isBusiness, changeCategoryName);

router.delete('/delete-product', verifyToken, isBusiness, deleteProduct);

router.post('/update-product', verifyToken, isBusiness, updateProductAsync);

module.exports = router;
