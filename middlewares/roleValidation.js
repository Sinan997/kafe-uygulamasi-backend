const jwt = require('jsonwebtoken')

const isAdmin = (req, res, next) => {
	const authHeader = req.headers.authorization
	console.log(authHeader);
	if (!authHeader) {
		return res.status(401).json({ message: 'Yetkili değil', success: false })
	}
	const token = authHeader.split(' ')[1]
	try {
		console.log({token});
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY)._doc
		console.log(user);
		if (user.role === 'admin') {
			req.user = user
			next()
		} else{
			return res.status(403).json({ message: 'Yetkili değil', success: false })
		}
	} catch (error) {
		return res.status(403).json({ message: 'Token geçersiz', success: false })
	}
}

module.exports = {
	isAdmin,
}
