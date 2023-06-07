const User = require('../models/user')
const bcrypt = require('bcryptjs')

const getAllUsers = async (req, res) => {
	const users = await User.find()
	if (!users) {
		return res.status(404).json({ message: 'Userları getirme işlemi başarısız oldu', success: false })
	}
	return res.status(200).json({ users, success: true })
}

const addUser = async (req, res) => {
	console.log('add user çalıştı');
	const { name, surname, username, password, role } = req.body
	const isUsernameExist = await User.findOne({ username })
	if (isUsernameExist) {
		return res.status(406).json({ message: 'Username kullanılmaktadır', succes: false })
	}

	try {
		const hashedPw = await bcrypt.hash(password, 10)

		const user = new User({
			name,
			surname,
			username,
			password: hashedPw,
			role,
		})

		await user.save()
		if (user) {
			return res.status(201).json({ message: 'Kullanıcı Oluşturuldu', succes: true })
		}
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: 'Kullanıcı Oluşturulamadı', succes: false })
	}
}

module.exports = {
	getAllUsers,
	addUser,
}
