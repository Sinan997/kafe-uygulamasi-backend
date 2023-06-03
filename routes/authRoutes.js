const express = require('express')
const router = express.Router()
const { postLogin } = require('../controllers/authControllers')
const { validateLogin } = require('../middlewares/loginValidation')
const verifyToken = require('../middlewares/verifyToken')

// router.post('/register', authController.register)

router.post('/login', validateLogin, postLogin)


module.exports = router
