const { roles } = require('../constants/roles');

const isAdminOrBusiness = (req, res, next) => {
  try {
    if (req.role === roles.Admin || req.role === roles.Business) {
      next();
    } else {
      return res.status(403).json({ message: 'Yetkili değil', success: false });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token geçersiz', success: false });
  }
};

module.exports = {
  isAdminOrBusiness,
};
