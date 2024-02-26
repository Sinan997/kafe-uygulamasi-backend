const express = require('express');
const router = express.Router();
const {
  addTable, getAllTables, deleteTable
} = require('../controllers/table-controller');
const { verifyToken } = require('../middlewares/verifyToken');
const { isBusiness } = require('../middlewares/isBusinessValidator');

router.post('/add-table', verifyToken, isBusiness, addTable);

router.get('/get-tables', verifyToken, isBusiness, getAllTables);

router.delete('/delete-table', verifyToken, isBusiness, deleteTable);

// router.put('/update-business', verifyToken, isBusiness, updateBusiness);

module.exports = router;