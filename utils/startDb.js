const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const startDB = async () => {
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const isExist = await User.findOne({ username: 'admin' });

    if (!isExist) {
      bcrypt.hash('123', 10).then(async (hashedPw) => {
        const user = new User({
          name: 'admin',
          username: 'admin',
          role: 'admin',
          password: hashedPw,
        });
        await user.save();
        console.log('admin yoktu ve admin oluşturuldu');
      });
    }
  });
};

module.exports = {
  startDB,
};
