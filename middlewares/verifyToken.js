const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).send('unauthorized');
	} else {
		const token = authHeader.split(' ')[1];
		try {
			jwt.verify(token, process.env.JWT_SECRET_KEY);
			next();
		} catch (error) {
			return res.status(401).json(error);
		}
	}
};

module.exports = verifyToken;
