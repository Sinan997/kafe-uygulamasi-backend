const express = require('express');
const { getAllUsers, addUser, deleteUser, updateUser } = require('../controllers/user-controllers');
const { verifyToken } = require('../middlewares/verify-token');
const { isBusiness } = require('../middlewares/is-business-validator');

const router = express.Router();

router.get('/all-users', verifyToken, isBusiness, getAllUsers);

router.post('/add-user', verifyToken, isBusiness, addUser);

router.delete('/delete-user', verifyToken, isBusiness, deleteUser);

router.put('/update-user', verifyToken, isBusiness, updateUser);

module.exports = router;
