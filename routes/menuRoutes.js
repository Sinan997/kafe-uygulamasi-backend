const express = require('express')
const router = express.Router()
const { addCategory, allCategories, deleteCategory, setCategoriesIndex, addProduct, getAllProducts, deleteProduct, changeCategoryName, setProductsIndex, updateProductAsync } = require('../controllers/menuController')
const { isAdmin } = require('../middlewares/roleValidation')

router.get('/all-categories', isAdmin, allCategories)

router.post('/add-category', isAdmin, addCategory)

router.delete('/delete-category', isAdmin, deleteCategory)

router.post('/set-categories-index', isAdmin, setCategoriesIndex)

router.post('/change-categoryName', isAdmin, changeCategoryName)

router.post('/add-product', isAdmin, addProduct)

router.get('/all-products/:categoryId', isAdmin, getAllProducts)

router.delete('/delete-product', isAdmin, deleteProduct)

router.post('/set-products-index', isAdmin, setProductsIndex)

router.post('/update-product', isAdmin, updateProductAsync)


module.exports = router
