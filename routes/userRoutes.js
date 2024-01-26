const express = require('express');
const { getAllUsers, addUser, deleteUser, updateUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isBusiness } = require('../middlewares/isBusinessValidator');

const router = express.Router();

router.get('/all-users', verifyToken, isBusiness, getAllUsers);

router.post('/add-user', verifyToken, isBusiness, addUser);

router.delete('/delete-user', verifyToken, isBusiness, deleteUser);

router.put('/update-user', verifyToken, isBusiness, updateUser);

module.exports = router;
