const express = require('express');
const router = express.Router();
const {
  addCategory,
  allCategories,
  deleteCategory,
  setCategoriesIndex,
} = require('../controllers/menuController');
const { isBusiness } = require('../middlewares/isBusinessValidator');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/all-categories', verifyToken, isBusiness, allCategories);

router.post('/add-category', verifyToken, isBusiness, addCategory);

router.delete('/delete-category', verifyToken, isBusiness, deleteCategory);

router.post('/set-categories-index', verifyToken, isBusiness, setCategoriesIndex);


module.exports = router;
