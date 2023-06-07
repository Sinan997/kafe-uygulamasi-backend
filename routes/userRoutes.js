const express = require('express')
const { getAllUsers, addUser } = require('../controllers/userController')
const { isAdmin } = require('../middlewares/roleValidation')
const { validateSignUp } = require('../middlewares/signUpValidation')
const router = express.Router()

router.get('/all-users', isAdmin, getAllUsers)

router.post('/add-user', isAdmin, validateSignUp, addUser)

module.exports = router
