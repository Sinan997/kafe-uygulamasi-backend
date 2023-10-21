const express = require('express');
const router = express.Router();
const { postLogin, logout } = require('../controllers/authControllers');
const { validateLogin } = require('../middlewares/loginValidation');

router.post('/login', validateLogin, postLogin);

router.post('/logout', logout);

module.exports = router;
