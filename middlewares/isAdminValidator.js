const isAdmin = (req, res, next) => {
	try {
		const user = req.user;
		if (user.role === 'admin') {
			next();
		} else {
			return res.status(403).json({ message: 'Yetkili değil', success: false });
		}
	} catch (error) {
		return res.status(401).json({ message: 'Token geçersiz', success: false });
	}
};

module.exports = {
	isAdmin,
};
