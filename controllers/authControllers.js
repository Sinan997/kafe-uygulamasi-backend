const User = require('../models/user')
const RefreshToken = require('../models/refreshToken')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// exports.register = async (req, res) => {
//   const { username, password, role } = req.body

//   if (!username || !password || !role) {
//     return res.status(404).json({ message: 'Fill all places' })
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10)

//     const newUser = new User({
//       username: username,
//       password: hashedPassword,
//       role: role,
//     })

//     await newUser.save()
//     return res.status(201).json({ message: 'User Created' })
//   } catch (error) {
//     console.log(error)
//   }
// }

const generateAccesToken = (user) => {
	return jwt.sign({ username: user.username, id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
}

const postLogin = async (req, res) => {
	const { username, password } = req.body

	const user = await User.findOne({ username })
	if (!user) {
		return res.status(404).json({ message: 'Kullanıcı bulunamadı', success: false })
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password)
	if (isPasswordCorrect) {
		const accessToken = generateAccesToken(user)
		return res.status(200).json({ accessToken, success: true })
	} else {
		return res.status(401).json({ message: 'Şifre yanlış', success: false })
	}
}

module.exports = {
	postLogin,
}

// const postLogout = async (req, res) => {
//   const refreshToken = req.body.refreshToken

//   RefreshToken.findOneAndDelete({ refreshToken: refreshToken }).then((err, result) => {
//     err && console.log(err)
//     console.log('refreshToken deleted')
//   })

//   res.status(200).json('you logged out succesfully')
// }

// const generateRefreshToken = (user) => {
//   return jwt.sign({ username: user.username, id: user._id, role: user.role }, process.env.JWT_REFRESH_KEY)
// }

// const postLogin = (req, res) => {
//   const { username, password } = req.body
//   User.findOne({ username }).then((user) => {
//     bcrypt.compare(password, user.password).then((result) => {
//       if (result) {
//         const accesToken = generateAccesToken(user)
//         const refreshToken = generateRefreshToken(user)
//         res.status(200).send({ accesToken, refreshToken })
//       }
//     })
//   })
// }

// const postRefreshToken = async (req, res) => {
//   let refreshToken = req.body.refreshToken

//   if (!refreshToken) return res.status(401).json('You are not authenticated!')
//   RefreshToken.findOne({ refreshToken }).then((isExist) => {
//     if (isExist) {
//       jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
//         err && console.log(err)
//         RefreshToken.findOneAndDelete({ refreshToken: refreshToken }).then((err, result) => {
//           err && console.log(err)
//           console.log('refreshToken deleted')
//         })
//         const newAccesToken = generateAccesToken(user)
//         const newRefreshToken = generateRefreshToken(user)
//         RefreshToken.create({ refreshToken: newRefreshToken })
//         res.status(200).json({ accesToken: newAccesToken, refreshToken: newRefreshToken })
//       })
//       // const accesToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 30 })
//       // const refreshToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_REFRESH_KEY)
//     } else {
//       return res.status(403).json('refresh token is not valid')
//     }
//   })
// }
