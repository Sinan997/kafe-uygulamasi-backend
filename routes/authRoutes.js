const express = require('express');
const router = express.Router();
const {
  loginController,
  logoutController,
  refreshTokenController,
} = require('../controllers/authControllers');

router.post('/login', loginController);

router.post('/logout', logoutController);

router.post('/refreshToken', refreshTokenController);

module.exports = router;
