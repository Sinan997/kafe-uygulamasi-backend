const express = require('express')
const router = express.Router()
const { postLogin } = require('../controllers/authControllers')
const { validateLogin } = require('../middlewares/loginValidation')

router.post('/login', validateLogin, postLogin)

module.exports = router
