const express = require('express');
const router = express.Router();
const {
  addBusiness,
  getAllBusinesses,
  deleteBusiness,
  updateBusiness,
} = require('../controllers/admin-controllers');

const { isAdmin } = require('../middlewares/is-admin-validator');
const { verifyToken } = require('../middlewares/verify-token');

router.get('/get-business', verifyToken, isAdmin, getAllBusinesses);

router.post('/add-business', verifyToken, isAdmin, addBusiness);

router.delete('/delete-business', verifyToken, isAdmin, deleteBusiness);

router.put('/update-business', verifyToken, isAdmin, updateBusiness);

module.exports = router;
