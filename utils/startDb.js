const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const startDB = async () => {
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const isExist = await User.findOne({ username: 'admin' });

    if (!isExist) {
      const hashedPw = await bcrypt.hash('123', 10);
      const user = new User({
        email: 'admin',
        username: 'admin',
        password: hashedPw,
        role: 'admin',
      });
      await user.save();
      console.log('admin created for initialization.');
    }
  });
};

module.exports = {
  startDB,
};
