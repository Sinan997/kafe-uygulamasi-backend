const validateSignUp = (req, res, next) => {
  const { name, surname, username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(406).json({ message: 'Lütfen Tüm Alanları Doldurun.', success: false });
  }
  next();
};

module.exports = { validateSignUp };
