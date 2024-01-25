const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { roles } = require('../constants/roles');

const addBusiness = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // VALIDATE FIELDS
    if ((!name, !email, !password)) {
      return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
    }

    const isNameExist = await Business.findOne({ name });
    if (isNameExist) {
      return res.status(406).json({ code: 'NAME_EXIST', data: { name }, message: 'name exist' });
    }

    // CREATE BUSINESS ADMIN

    const username = name.toLowerCase().replace(/\s/g, '') + '.admin';

    const hashedPw = await bcrypt.hash(password, 10);

    const user = await new User({
      email,
      username,
      password: hashedPw,
      role: roles.Business,
    }).save();

    // ADD BUSINESS
    const business = await new Business({ name, ownerId: user._id }).save();

    // UPDATE USER BUSINESS_ID
    await User.findByIdAndUpdate(user._id, { businessId: business._id });

    return res
      .status(201)
      .json({ code: 'BUSINESS_CREATED', message: 'Business created successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('ownerId');
    if (!businesses) {
      return res.status(404).json({
        code: 'BUSINESS_TABLE',
        message: 'An error occurred while bringing in the businesses.',
      });
    }
    return res.status(200).json({ businesses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const deleteBusiness = async (req, res) => {
  const { id } = req.body;
  try {
    const business = await Business.findByIdAndDelete(id);
    console.log(business);
    if (!business) {
      return res.status(404).json({ code: 'BUSINESS_NOT_FOUND', message: 'Business not found.' });
    }
    await User.findByIdAndDelete(business.ownerId);

    return res
      .status(200)
      .json({ code: 'BUSINESS_DELETED', message: 'Business has been deleted.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const editBusiness = async (req, res) => {
  const { _id, ownerId, name, email, password } = req.body;
  try {
    const updateObject = { email };
    if (password) {
      console.log('password var');
      const hashedPw = await bcrypt.hash(password, 10);
      updateObject.password = hashedPw;
    }
    await Business.findByIdAndUpdate(_id, { name });
    await User.findByIdAndUpdate(ownerId, updateObject);

    return res
      .status(200)
      .json({ code: 'BUSINESS_UPDATED', message: 'Business updated successfully.' });
  } catch (error) {
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

module.exports = {
  addBusiness,
  getAllBusinesses,
  deleteBusiness,
  editBusiness,
};
