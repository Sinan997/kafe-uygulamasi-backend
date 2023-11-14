const express = require('express');
const router = express.Router();
const {
  addBusiness,
} = require('../controllers/businessController');

router.post('/add-business', addBusiness);

module.exports = router;
