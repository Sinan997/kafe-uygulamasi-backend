const Business = require('../models/Business');
const User = require('../models/User');
const Categories = require('../models/Category');
const Product = require('../models/Product');
const Table = require('../models/Table');
const Order = require('../models/Order');
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
      return res
        .status(406)
        .json({ code: 'NAME_EXIST', data: { name }, message: `${name} is already used` });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res
        .status(406)
        .json({ code: 'EMAIL_EXIST', data: { email }, message: `${email} is already used` });
    }

    // CREATE BUSINESS ADMIN
    const username = name.toLowerCase().replace(/\s/g, '') + '.admin';

    const hashedPw = await bcrypt.hash(password, 10);

    const user = await new User({
      username,
      email,
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
      return res.status(400).json({
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
    // DELETE BUSINESS
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res.status(404).json({ code: 'BUSINESS_NOT_FOUND', message: 'Business not found.' });
    }
    // DELETE OWNER
    await User.findByIdAndDelete(business.ownerId);

    // DELETE WAITERS
    await User.deleteMany({ businessId: id });

    // DELETE CATEGORIES
    await Categories.deleteMany({ businessId: id });

    // DELETE PRODUCTS
    await Product.deleteMany({ businessId: id });

    // DELETE TABLES
    await Table.deleteMany({ businessId: id });

    // DELETE ORDERS
    await Order.deleteMany({ businessId: id });

    return res
      .status(200)
      .json({ code: 'BUSINESS_DELETED', message: 'Business deleted succesfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const updateBusiness = async (req, res) => {
  const { _id, ownerId, name, email, password } = req.body;
  try {
    const business = await Business.findById(_id);
    const owner = await User.findById(ownerId);

    if (!business || !owner) {
      return res.status(404).json({ code: 'BUSINESS_NOT_FOUND', message: 'Business not found.' });
    }

    const ownerUpdateObject = {};

    if (password) {
      const hashedPw = await bcrypt.hash(password, 10);
      ownerUpdateObject.password = hashedPw;
    }

    // CHECK IF NAME IS CHANGED AND IF IT IS USED
    if (business.name !== name) {
      const isNameExist = await Business.findOne({ name });
      if (isNameExist) {
        return res
          .status(406)
          .json({ code: 'NAME_EXIST', data: { name }, message: `${name} is already used` });
      }
    }

    // CHECK IF EMAIL IS CHANGED AND IF IT IS USED
    if (owner.email !== email) {
      const isEmailExist = await User.findOne({ email });
      ownerUpdateObject.email = email;
      if (isEmailExist) {
        return res
          .status(406)
          .json({ code: 'EMAIL_EXIST', data: { email }, message: `${email} is already used` });
      }
    }

    ownerUpdateObject.username = name.toLowerCase().replace(/\s/g, '') + '.admin';

    await Business.findByIdAndUpdate(_id, { name });
    await User.findByIdAndUpdate(ownerId, ownerUpdateObject);

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
  updateBusiness,
};
