const express = require('express')
const router = express.Router()
const { isAdmin } = require('../middlewares/roleValidation')
const { createTables } = require('../controllers/tableController')

router.post('/create-tables', isAdmin, createTables)

module.exports = router