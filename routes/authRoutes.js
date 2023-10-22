const express = require('express');
const router = express.Router();
const { postLogin, logoutController, refreshTokenController } = require('../controllers/authControllers');
const { validateLogin } = require('../middlewares/loginValidation');

router.post('/login', validateLogin, postLogin);

router.post('/logout', logoutController);

router.post('/refreshToken', refreshTokenController);

module.exports = router;
