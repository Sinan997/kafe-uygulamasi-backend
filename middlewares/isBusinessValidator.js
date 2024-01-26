const { roles } = require('../constants/roles');

const isBusiness = (req, res, next) => {
  try {
    if (req.role === roles.Business) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized.', success: false });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid.', success: false });
  }
};

module.exports = {
  isBusiness,
};
