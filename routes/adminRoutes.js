const express = require('express');
const router = express.Router();
const { addBusiness, getAllBusinesses, deleteBusiness } = require('../controllers/admin-controllers');

const { isAdmin } = require('../middlewares/isAdminValidator');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/get-business', verifyToken, isAdmin, getAllBusinesses);

router.post('/add-business', verifyToken, isAdmin, addBusiness);

router.delete('/delete-business', verifyToken, isAdmin, deleteBusiness);

module.exports = router;