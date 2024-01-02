const User = require('../models/User');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');
const { roles } = require('../constants/roles');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password -__v').populate('businessId', 'name');
  if (!users) {
    return res
      .status(404)
      .json({ message: 'Userları getirme işlemi başarısız oldu', success: false });
  }
  return res.status(200).json({ users, message: 'Userları Başarıyla getirildi', success: true });
};

const addUser = async (req, res) => {
  const { email, username, password, role, businessName } = req.body;
  const isUsernameExist = await User.findOne({ username });
  if (isUsernameExist) {
    return res.status(406).json({ message: 'Username kullanılmaktadır', success: false });
  }

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return res.status(406).json({ message: 'Email kullanılmaktadır', success: false });
  }

  const hashedPw = await bcrypt.hash(password, 10);

  // if new user is admin
  if (role === 'admin') {
    try {
      const user = await new User({ email, username, role, password: hashedPw }).save();

      if (user) {
        return res.status(201).json({ message: 'Kullanıcı Oluşturuldu', success: true });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: 'Kullanıcı Oluşturulamadı', success: false });
    }
  }

  // if new user is new business
  // create Business
  const business = await new Business({ name: businessName }).save();

  try {
    const user = await new User({
      email,
      username,
      password: hashedPw,
      role,
      businessId: business._id,
    }).save();

    business.addToUsers(user._id);
    if (user) {
      return res.status(201).json({ message: 'Kullanıcı Oluşturuldu', success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kullanıcı Oluşturulamadı', success: false });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı Bulunamadı', success: false });
    }

    if (user.businessId) {
      const id = user.businessId.toString();
      await Business.findByIdAndDelete(id);
    }

    await user.deleteOne();

    return res.status(201).json({ message: 'Kullanıcı Silindi', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kullanıcı Silinemedi', success: false });
  }
};

const updateUser = async (req, res) => {
  const { _id, username, password } = req.body;
  let user;
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.findByIdAndUpdate(
        _id,
        { username, password: hashedPassword },
        { new: true },
      );
      return res.status(200).json({ message: 'Kullanıcı Güncellendi', success: true });
    } else {
      user = await User.findByIdAndUpdate(_id, { username }, { new: true });
    }
    return res.status(200).json({ message: 'Kullanıcı Güncellendi', success: true });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'Kullanıcı Güncellenemedi', success: false });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
};
