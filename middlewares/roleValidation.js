const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: 'Yetkili değil', success: false });
	}
	const token = authHeader.split(' ')[1];
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
		if (user.role === 'admin') {
			next();
		} else {
			return res.status(403).json({ message: 'Yetkili değil', success: false });
		}
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: 'Token geçersiz', success: false });
	}
};

module.exports = {
	isAdmin,
};
