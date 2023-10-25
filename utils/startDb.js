const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const startDB = async () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    User.findOne({ username: 'admin' }).then((user) => {
      if (!user) {
        bcrypt.hash('123', 10).then((hashedPw) => {
          const user = new User({
            name: 'admin',
            surname: 'admin',
            username: 'admin',
            role: 'admin',
            password: hashedPw,
          });
          const user2 = new User({
            name: 'Sinan',
            surname: 'Öztürk',
            username: 'sinan.ozturk',
            role: 'user',
            password: hashedPw,
          });
          user.save();
          user2.save();
          console.log('admin ve user oluşturuldu');
        });
      }
    });
  });
};

module.exports = {
  startDB,
};
