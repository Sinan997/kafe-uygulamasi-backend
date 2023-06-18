const express = require('express')
const router = express.Router()
const { addCategory, allCategories } = require('../controllers/menuController')
const { isAdmin } = require('../middlewares/roleValidation')

router.get('/all-categories', isAdmin, allCategories)

router.post('/add-category', isAdmin, addCategory)

module.exports = router
