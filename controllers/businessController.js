const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const addBusiness = async (req, res) => {
  const { username } = req.body;

  const business = new Business({ name: username });

  const createdBusiness = await business.save();

  bcrypt.hash('123', 10).then(async (hashedPw) => {
    const user = new User({
      username: createdBusiness.name + '.admin',
      businessId: createdBusiness._id,
      password: hashedPw,
      role: 'admin',
    });

    const createdUser = await user.save();

    business.addToUsers(createdUser._id);
  });

  return res.status(200).send('saved');
};

module.exports = {
  addBusiness,
};
