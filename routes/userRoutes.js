const express = require('express');
const { getAllUsers, addUser, deleteUser, updateUser } = require('../controllers/userController');
const { isAdmin } = require('../middlewares/isAdminValidator');
const { validateSignUp } = require('../middlewares/signUpValidation');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/all-users', verifyToken, isAdmin, getAllUsers);

router.post('/add-user', verifyToken, isAdmin, validateSignUp, addUser);

router.delete('/delete-user', verifyToken, isAdmin, deleteUser);

router.put('/update-user', verifyToken, isAdmin, updateUser);

module.exports = router;
