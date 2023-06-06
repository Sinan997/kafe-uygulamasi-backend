const express = require('express')
const { startDB } = require('./utils/startDb')
const app = express()
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.listen(8080, () => {
  console.log('server ayağa kalktı');
	startDB()
})
