const validateLogin = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(406).json({ message: 'Kullanıcı adı veya password eksik', success: false })
  } else {
    next()
  }
}

module.exports = { validateLogin }
