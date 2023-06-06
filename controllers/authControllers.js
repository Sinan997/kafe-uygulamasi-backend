const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const postLogin = async (req, res) => {
	const { username, password } = req.body

	const user = await User.findOne({ username })
	if (!user) {
		return res.status(404).json({ message: 'Kullanıcı bulunamadı', success: false })
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password)
	if (isPasswordCorrect) {
		user.password = undefined
		user.__v = undefined
		const accessToken = generateAccesToken(user)
		return res.status(200).json({ accessToken, user, success: true })
	} else {
		return res.status(401).json({ message: 'Şifre yanlış', success: false })
	}
}

module.exports = {
	postLogin,
}

const generateAccesToken = (user) => {
	return jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
}
