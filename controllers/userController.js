const User = require('../models/user')

const getAllUsers = async (req, res) => {
	const users = await User.find()
	if (!users) {
		return res.status(404).json({ message: 'Userları getirme işlemi başarısız oldu', success: false })
	}
	return res.status(200).json({ users, success: true })
}

module.exports = {
  getAllUsers
}