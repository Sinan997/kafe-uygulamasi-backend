const express = require('express')
const { startDB } = require('./utils/startDb')
const app = express()
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()


app.use(cors())
app.use(express.json())
app.use(authRoutes)

app.get('/',(req,res)=>{
  res.send('çalışıyor')
})

app.listen(8080, () => {
  startDB()
})
