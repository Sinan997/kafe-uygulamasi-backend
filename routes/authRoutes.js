const express = require('express');
const router = express.Router();
const { login, logoutController, refreshTokenController } = require('../controllers/authControllers');
const { validateLoginFields } = require('../middlewares/loginValidation');

router.post('/login', validateLoginFields, login);

router.post('/logout', logoutController);

router.post('/refreshToken', refreshTokenController);

module.exports = router;
