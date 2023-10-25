const express = require('express');
const router = express.Router();
const {
  loginController,
  logoutController,
  refreshTokenController,
} = require('../controllers/authControllers');
const { validateLoginFields } = require('../middlewares/loginValidation');

router.post('/login', validateLoginFields, loginController);

router.post('/logout', logoutController);

router.post('/refreshToken', refreshTokenController);

module.exports = router;
