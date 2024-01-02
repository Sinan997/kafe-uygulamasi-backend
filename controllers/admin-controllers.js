const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { roles } = require('../constants/roles');

const addBusiness = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // VALIDATE FIELDS
    if ((!name, !email, !password)) {
      return res
        .status(406)
        .json({ code: 'MISSING_FIELDS', message: 'Eksik veri', success: false });
    }
    console.log('after if');
    const isNameExist = await Business.findOne({ name });
    if (isNameExist) {
      return res.status(406).json({ code: 'NAME_EXIST', message: 'name exist', success: false });
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

    return res.status(201).json({ code: 'BUSINESS_CREATED', message: 'Eksik veri', success: true });
  } catch (error) {
    console.log(error);
  }
};

const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('ownerId');
    if (!businesses) {
      return res
        .status(404)
        .json({ message: 'businessları getirme işlemi başarısız oldu', success: false });
    }
    return res
      .status(200)
      .json({ businesses, message: 'businesses Başarıyla getirildi', success: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteBusiness = async (req, res) => {
  const { id } = req.body;
  try {
    const business = await Business.findByIdAndDelete(id);

    if (!business) {
      return res.status(404).json({ message: 'İşletme Bulunamadı', success: false });
    }
    await User.findByIdAndDelete(business.ownerId);

    return res
      .status(201)
      .json({ code: 'BUSINESS_DELETED', message: 'İşletme Silindi', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kullanıcı Silinemedi', success: false });
  }
};

module.exports = {
  addBusiness,
  getAllBusinesses,
  deleteBusiness,
};
