const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (!user) {
		return res.status(400).json({ message: 'Kullanıcı bulunamadı', success: false });
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);

	if (isPasswordCorrect) {
		const accessToken = generateToken(user, process.env.JWT_SECRET_KEY, '1m');
		const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '2m');
		RefreshToken.deleteOne({ userId: user._id }).then(() => {
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
		id: decodedToken.id,
		role: decodedToken.role,
		name: decodedToken.name,
		surname: decodedToken.surname,
		username: decodedToken.decodedTokenname,
	};

	const newAccessToken = generateToken(user, process.env.JWT_SECRET_KEY, '1m');
	const newRefreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '2m');

	return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

module.exports = {
	login,
	logoutController,
	refreshTokenController,
};

const generateToken = (user, secretKey, expiresIn) => {
	options = {
		id: user._id,
		role: user.role,
		name: user.name,
		surname: user.surname,
		username: user.username,
	};
	return jwt.sign(options, secretKey, { expiresIn });
};
