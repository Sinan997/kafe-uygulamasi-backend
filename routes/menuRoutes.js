const express = require('express');
const router = express.Router();
const {
  addCategory,
  allCategories,
  deleteCategory,
  setCategoriesIndex,
  addProduct,
  getAllProducts,
  deleteProduct,
  changeCategoryName,
  setProductsIndex,
  updateProductAsync,
} = require('../controllers/menuController');
const { isAdmin } = require('../middlewares/isAdminValidator');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/all-categories', verifyToken, isAdmin, allCategories);

router.post('/add-category', verifyToken, isAdmin, addCategory);

router.delete('/delete-category', verifyToken, isAdmin, deleteCategory);

router.post('/set-categories-index', verifyToken, isAdmin, setCategoriesIndex);

router.post('/change-categoryName', verifyToken, isAdmin, changeCategoryName);

router.post('/add-product', verifyToken, isAdmin, addProduct);

router.get('/all-products/:categoryId', verifyToken, isAdmin, getAllProducts);

router.delete('/delete-product', verifyToken, isAdmin, deleteProduct);

router.post('/set-products-index', verifyToken, isAdmin, setProductsIndex);

router.post('/update-product', verifyToken, isAdmin, updateProductAsync);

module.exports = router;
