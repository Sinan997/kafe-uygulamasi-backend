const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const startDB = () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    User.findOne({ username: 'admin' }).then((user) => {
      if (!user) {
        bcrypt.hash('admin', 10).then((hashedPw) => {
          const user = new User({
            username: 'admin',
            role: 'admin',
            password: hashedPw,
          })
          const user2 = new User({
            username: 'sinan',
            role: 'user',
            password: hashedPw,
          })
          user.save()
          user2.save()
          console.log('admin oluşturuldu')
        })
      }
    })
  })
}

module.exports = {
  startDB,
}
