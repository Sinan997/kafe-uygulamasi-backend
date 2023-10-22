const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(404).send('unauthorized')
  } else {
    const token = authHeader.split(' ')[1]
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY)
      next()
    } catch (error) {
      return res.status(403).json(error)
    }
  }
}

module.exports = verifyToken
