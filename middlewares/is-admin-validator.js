const { roles } = require('../constants/roles');

const isAdmin = (req, res, next) => {
  try {
    if (req.role === roles.Admin) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized.', success: false });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token geçersiz', success: false });
  }
};

module.exports = {
  isAdmin,
};
