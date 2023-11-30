const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Kullanıcı bulunamadı', success: false });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    const accessToken = generateToken(user, process.env.JWT_SECRET_KEY, '20m');
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '7d');
    RefreshToken.deleteOne({ userId: user._id }).then((res) => {
      new RefreshToken({ token: refreshToken, userId: user._id }).save();
    });
    return res.status(200).json({ accessToken, refreshToken, success: true });
  } else {
    return res.status(400).json({ message: 'Şifre yanlış', success: false });
  }
};

const logoutController = async (req) => {
  const { refreshToken } = req.body;

  RefreshToken.deleteOne({ token: refreshToken });
};

const refreshTokenController = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Token bulunamadı', success: false });
  }

  RefreshToken.findOneAndDelete({ token: refreshToken });

  const decodedToken = jwt.decode(refreshToken);

  if (new Date().getTime() > decodedToken.exp * 1000) {
    return res.status(400).json({ message: 'Refresh Tokenın süresi bitmiş', success: false });
  }

  const user = {
    _id: decodedToken._id,
    email: decodedToken.email,
    username: decodedToken.username,
    role: decodedToken.role,
    businessId: decodedToken.businessId,
  };

  const newAccessToken = generateToken(user, process.env.JWT_SECRET_KEY, '20m');
  const newRefreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '7d');

  return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

const generateToken = (user, secretKey, expiresIn) => {
  options = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    businessId: user.businessId,
  };
  return jwt.sign(options, secretKey, { expiresIn });
};

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
};