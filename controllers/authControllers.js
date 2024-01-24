const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).populate('businessId');

    if (!user) {
      return res.status(400).json({
        code: 'USER_NOT_FOUND',
        data: { username },
        message: `User named '${username}' not found.`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const accessToken = generateToken(user, process.env.JWT_SECRET_KEY, '1m');
      const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '7d');
      RefreshToken.deleteOne({ userId: user._id }).then(() => {
        new RefreshToken({ token: refreshToken, userId: user._id }).save();
      });
      return res.status(200).json({
        accessToken,
        refreshToken,
        code: 'LOGIN_SUCCESSFULL',
        message: 'Logged in succesfully.',
      });
    } else {
      return res.status(400).json({ code: 'WRONG_PASSWORD', message: 'Wrong Password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const logoutController = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    RefreshToken.deleteOne({ token: refreshToken });
    return res.status(200).json({ message: 'Çıkış yapıldı', success: true });
  } catch (error) {
    return res.status(400).json({ message: 'Çıkış yapılamadı', success: false });
  }
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
    businessName: decodedToken.businessName,
  };

  const newAccessToken = generateToken(user, process.env.JWT_SECRET_KEY, '1m');
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
    businessName: user.businessId?.name,
  };
  return jwt.sign(options, secretKey, { expiresIn });
};

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
};
