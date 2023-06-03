const jwt = require('jsonwebtoken')

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(404).send('unauthorized')
  }else{
    const token = authHeader.split(' ')[1]
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
      if(user.role === 'admin'){
        req.user = user
        next()
      }
    } catch (error) {
      return res.status(403).send(error.message)
    }
  }
}

module.exports = {
  isAdmin,
}
