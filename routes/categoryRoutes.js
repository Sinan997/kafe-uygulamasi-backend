const express = require('express');
const router = express.Router();
// const {
//   addCategory,
//   allCategories,
//   deleteCategory,
//   setCategoriesIndex,
//   addProduct,
//   getAllProducts,
//   deleteProduct,
//   changeCategoryName,
//   setProductsIndex,
//   updateProductAsync,
// } = require('../controllers/menuController');
const {
  getAllProducts,
  addProduct,
  getCategory,
  changeCategoryName,
  deleteProduct,
  setProductsIndex,
  updateProductAsync,
} = require('../controllers/categoryController');
const { isAdmin } = require('../middlewares/isAdminValidator');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/get-category/:categoryId', verifyToken, isAdmin, getCategory);
router.get('/all-products/:categoryId', verifyToken, isAdmin, getAllProducts);
router.post('/add-product', verifyToken, isAdmin, addProduct);
router.post('/change-category-name', verifyToken, isAdmin, changeCategoryName);
router.delete('/delete-product', verifyToken, isAdmin, deleteProduct);
router.post('/set-products-index', verifyToken, isAdmin, setProductsIndex);
router.post('/update-product', verifyToken, isAdmin, updateProductAsync);

module.exports = router;
