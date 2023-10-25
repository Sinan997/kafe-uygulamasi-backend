const express = require('express');
const {
  getAllUsers,
  addUser,
  deleteUser,
  deleteUsers,
  updateUser,
} = require('../controllers/userController');
const { isAdmin } = require('../middlewares/roleValidation');
const { validateSignUp } = require('../middlewares/signUpValidation');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/all-users', verifyToken, isAdmin, getAllUsers);

router.post('/add-user', isAdmin, validateSignUp, addUser);

router.delete('/delete-user', isAdmin, deleteUser);

router.delete('/delete-users', isAdmin, deleteUsers);

router.put('/update-user', isAdmin, updateUser);

module.exports = router;
