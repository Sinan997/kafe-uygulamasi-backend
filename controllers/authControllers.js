const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res.status(404).json({ message: 'Kullanıcı bulunamadı', success: false });
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if (isPasswordCorrect) {
		const accessToken = generateToken(user, process.env.JWT_SECRET_KEY, '1m');
		const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, '7d');
		new RefreshToken({ token: refreshToken }).save();
		return res.status(200).json({ accessToken, refreshToken, success: true });
	} else {
		return res.status(401).json({ message: 'Şifre yanlış', success: false });
	}
};

const logout = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(404).json({ message: 'Token bulunamadı', success: false });
	}

	const response = jwt.decode(refreshToken);
	console.log('response',response);
};

module.exports = {
	postLogin,
	logout,
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
