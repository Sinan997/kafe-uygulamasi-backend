const User = require('../models/User');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');
const { roles } = require('../constants/roles');

const getAllUsers = async (req, res) => {
  try {
    const businessId = req.user.businessId._id;
    const users = await User.find({ businessId }).select('-password -__v').populate('businessId');
    if (!users) {
      return res.status(400).json({
        code: 'IDENTITY_TABLE',
        message: 'An error occurred while bringing in the users.',
      });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const addUser = async (req, res) => {
  const { email, password } = req.body;
  let { username } = req.body;
  const businessName = req.user.businessId.name;
  const businessId = req.user.businessId._id;
  try {
    // VALIDATE FIELDS
    if (!username || !email || !password) {
      return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
    }

    // update username as => username.businessName
    username = username.toLowerCase().replace(/\s/g, '') + '.' + businessName;

    // VALIDATE IS USERNAME AND EMAIL EXISTS
    const isUsernameExist = await User.findOne({ username });
    if (isUsernameExist) {
      return res.status(406).json({
        code: 'USERNAME_EXIST',
        data: { username },
        message: `${username} is already used`,
      });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(406).json({
        code: 'EMAIL_EXIST',
        message: `Email is already used`,
      });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await new User({
      username,
      email,
      password: hashedPw,
      role: roles.Waiter,
      businessId,
    }).save();

    // ADD TO BUSINESS WAITERS LIST
    const business = await Business.findById(businessId);
    await business.addToWaiters(user._id);

    return res.status(201).json({ code: 'USER_CREATED', message: 'User created successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;
  const businessId = req.user.businessId._id;
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const business = await Business.findById(businessId);
    await business.removeFromWaiters(user._id);

    return res
      .status(200)
      .json({ code: 'USER_DELETED', message: 'User deleted succesfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateUser = async (req, res) => {
  const { _id, email, password } = req.body;
  let { username } = req.body;
  const businessName = req.user.businessId.name;

  try {
    // MANIPULATE USERNAME
    if (!username.includes('.' + businessName)) {
      username = username.toLowerCase().replace(/\s/g, '') + '.' + businessName;
    } else {
      username = username.toLowerCase().replace(/\s/g, '');
    }

    const user = await User.findById(_id);


    const isUsernameExist = await User.findOne({ username });
    if (isUsernameExist) {
      return res.status(406).json({
        code: 'USERNAME_EXIST',
        data: { username },
        message: `${username} is already used`,
      });
    }

    // CHECK IS EMAIL EXISTING
    if (user.email !== email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(406).json({
          code: 'EMAIL_EXIST',
          message: `Email is already used`,
        });
      }
    }

    const updateObject = { username, email };
    if (password) {
      const hashedPw = await bcrypt.hash(password, 10);
      updateObject.password = hashedPw;
    }
    await User.findByIdAndUpdate(_id, updateObject);
    return res.status(200).json({ code: 'USER_UPDATED', message: 'User updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
};
