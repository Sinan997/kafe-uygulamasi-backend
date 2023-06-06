const express = require('express')
const { getAllUsers } = require('../controllers/userController')
const { isAdmin } = require('../middlewares/roleValidation')
const router = express.Router()

router.get('/all-users', isAdmin, getAllUsers)

module.exports = router
